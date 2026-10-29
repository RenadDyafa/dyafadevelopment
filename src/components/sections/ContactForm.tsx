"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";
import { contactSchema, inquiryTypes, type ContactField, type ContactResult } from "@/lib/contact/schema";
import { easeArch } from "@/components/motion/Reveal";

type Status = "idle" | "sending" | "success" | "error" | "rate_limited";

/** The interactive island of the contact section: validation, submission, status. */
export function ContactForm({ c, locale }: { c: Dictionary["contact"]; locale: Locale }) {
  const f = c.form;
  const startedAt = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<ContactField, true>>>({});

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      inquiry: String(fd.get("inquiry") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
      locale,
      startedAt: startedAt.current,
    };

    const check = contactSchema.safeParse(payload);
    if (!check.success) {
      const next: Partial<Record<ContactField, true>> = {};
      for (const issue of check.error.issues) next[issue.path[0] as ContactField] = true;
      setErrors(next);
      setStatus("idle");
      const first = Object.keys(next)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as ContactResult;
      if (data.ok) {
        setStatus("success");
        form.reset();
      } else if (data.reason === "invalid") {
        setErrors(data.fields);
        setStatus("error");
      } else setStatus(data.reason === "rate_limited" ? "rate_limited" : "error");
    } catch {
      setStatus("error");
    }
  }

  const err = (k: ContactField) => (errors[k] ? `err-${k}` : undefined);

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby="form-status" className="grid gap-x-8 gap-y-7 bg-ink/60 p-6 backdrop-blur-md md:grid-cols-2 md:p-10">
      <p className="eyebrow text-sand md:col-span-2">{c.cta}</p>

      <Field label={f.name} id="name" error={errors.name && f.errors.name}>
        <input id="name" name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={err("name")} className={inputCls} />
      </Field>
      <Field label={f.company} id="company" optional={f.optional}>
        <input id="company" name="company" autoComplete="organization" className={inputCls} />
      </Field>
      <Field label={f.email} id="email" error={errors.email && f.errors.email}>
        <input id="email" name="email" type="email" dir="ltr" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={err("email")} className={inputCls} />
      </Field>
      <Field label={f.phone} id="phone" optional={f.optional} error={errors.phone && f.errors.phone}>
        <input id="phone" name="phone" type="tel" dir="ltr" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={err("phone")} className={`${inputCls} rtl:text-end`} />
      </Field>
      <Field label={f.inquiry} id="inquiry" className="md:col-span-2" error={errors.inquiry && f.errors.inquiry}>
        <select id="inquiry" name="inquiry" required defaultValue="" aria-invalid={!!errors.inquiry} aria-describedby={err("inquiry")} className={`${inputCls} appearance-none bg-transparent`}>
          <option value="" disabled className="text-charcoal">
            {f.inquiryPlaceholder}
          </option>
          {inquiryTypes.map((k) => (
            <option key={k} value={k} className="text-charcoal">
              {f.inquiries[k]}
            </option>
          ))}
        </select>
      </Field>
      <Field label={f.message} id="message" className="md:col-span-2" error={errors.message && f.errors.message}>
        <textarea id="message" name="message" rows={4} required aria-invalid={!!errors.message} aria-describedby={err("message")} className={`${inputCls} resize-y`} />
      </Field>

      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="text-xs leading-relaxed text-bone/55 md:col-span-2">{f.consent}</p>

      <div className="flex flex-wrap items-center gap-6 md:col-span-2">
        <motion.button
          type="submit"
          disabled={status === "sending"}
          whileTap={{ scale: 0.98 }}
          className="group inline-flex h-14 items-center gap-4 bg-bone px-8 text-sm font-medium text-charcoal transition-colors hover:bg-sand disabled:opacity-60"
        >
          {status === "sending" ? f.sending : f.submit}
          <span aria-hidden className="block h-px w-6 bg-current transition-[width] duration-500 group-hover:w-10" />
        </motion.button>
        <div id="form-status" role="status" aria-live="polite" className="min-h-6 flex-1 text-sm">
          <AnimatePresence mode="wait">
            {status === "success" && <StatusMsg key="s" tone="ok">{f.success}</StatusMsg>}
            {status === "error" && <StatusMsg key="e" tone="bad">{f.error}</StatusMsg>}
            {status === "rate_limited" && <StatusMsg key="r" tone="bad">{f.rateLimited}</StatusMsg>}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
}

const inputCls =
  "peer w-full border-0 border-b border-bone/25 bg-transparent px-0 py-3 text-base text-bone outline-none transition-colors placeholder:text-bone/30 focus:border-sand aria-[invalid=true]:border-[#e0a48f]";

function Field({
  label,
  id,
  children,
  error,
  optional,
  className,
}: {
  label: string;
  id: string;
  children: ReactNode;
  error?: string | false;
  optional?: string;
  className?: string;
}) {
  return (
    <div className={`relative flex flex-col gap-1 ${className ?? ""}`}>
      <label htmlFor={id} className="text-xs tracking-wide text-bone/60">
        {label}
        {optional && <span className="ms-2 text-bone/35">({optional})</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`err-${id}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-[#e9b8a6]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusMsg({ children, tone }: { children: ReactNode; tone: "ok" | "bad" }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: easeArch }}
      className={tone === "ok" ? "text-sand" : "text-[#e9b8a6]"}
    >
      {children}
    </motion.p>
  );
}
