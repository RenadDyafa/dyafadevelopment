import { NextResponse, type NextRequest } from "next/server";
import { contactSchema, type ContactField, type ContactResult } from "@/lib/contact/schema";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 2500;
// Per-instance limiter. Swap for a shared store (e.g. Redis) when running multiple instances.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

async function deliver(data: Record<string, string>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    // No mail provider configured: accept the enquiry and record it server-side only.
    console.info("[contact] enquiry received (mail delivery not configured)", {
      inquiry: data.inquiry,
      locale: data.locale,
      at: new Date().toISOString(),
    });
    return;
  }
  const rows = Object.entries(data)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6d6d61">${escape(k)}</td><td>${escape(v)}</td></tr>`)
    .join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `Website enquiry — ${data.inquiry} — ${data.name}`,
      html: `<table style="font-family:sans-serif;font-size:14px">${rows}</table>`,
    }),
  });
  if (!res.ok) throw new Error(`Mail provider responded ${res.status}`);
}

export async function POST(req: NextRequest) {
  const json = (body: ContactResult, status = 200) => NextResponse.json(body, { status });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  if (rateLimited(ip)) return json({ ok: false, reason: "rate_limited" }, 429);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, reason: "invalid", fields: {} }, 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Partial<Record<ContactField, true>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "website" || key === "startedAt") {
        // Bot signal — respond as if accepted, deliver nothing.
        return json({ ok: true });
      }
      if (typeof key === "string") fields[key as ContactField] = true;
    }
    return json({ ok: false, reason: "invalid", fields }, 422);
  }

  const { website, startedAt, ...data } = parsed.data;
  if (website || Date.now() - startedAt < MIN_FILL_MS) return json({ ok: true });

  try {
    await deliver({
      name: data.name,
      company: data.company || "—",
      email: data.email,
      phone: data.phone || "—",
      inquiry: data.inquiry,
      locale: data.locale,
      message: data.message,
    });
    return json({ ok: true });
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return json({ ok: false, reason: "server" }, 502);
  }
}
