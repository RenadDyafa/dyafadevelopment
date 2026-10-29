import * as z from "zod/mini";

export const inquiryTypes = ["development", "investment", "land", "media", "careers", "other"] as const;
export type InquiryType = (typeof inquiryTypes)[number];

const emptyOr = <T extends z.core.SomeType>(schema: T) => z.optional(z.union([schema, z.literal("")]));

/**
 * Shared by the client form and the API route (zod/mini keeps the client bundle small).
 * Error messages are keys, localized in the UI.
 */
export const contactSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(2, "name"), z.maxLength(120, "name")),
  company: emptyOr(z.string().check(z.trim(), z.maxLength(160))),
  email: z.string().check(z.trim(), z.maxLength(200, "email"), z.email("email")),
  phone: emptyOr(z.string().check(z.trim(), z.maxLength(32, "phone"), z.regex(/^[+()\-\s\d٠-٩]{0,32}$/, "phone"))),
  inquiry: z.enum(inquiryTypes, "inquiry"),
  message: z.string().check(z.trim(), z.minLength(10, "message"), z.maxLength(4000, "message")),
  locale: z._default(z.enum(["en", "ar"]), "en"),
  // Anti-spam: honeypot must stay empty, form must have been open a few seconds.
  website: emptyOr(z.string().check(z.maxLength(0))),
  startedAt: z.number().check(z.int(), z.positive()),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = "name" | "email" | "phone" | "inquiry" | "message";

export type ContactResult =
  | { ok: true }
  | { ok: false; reason: "invalid"; fields: Partial<Record<ContactField, true>> }
  | { ok: false; reason: "rate_limited" | "server" };
