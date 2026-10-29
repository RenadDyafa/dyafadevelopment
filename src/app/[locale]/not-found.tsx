import Link from "next/link";
import { Symbol } from "@/components/brand/Symbol";

// Rendered inside the locale layout; the locale itself is not known here, so the
// message is bilingual.
export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-10 bg-charcoal px-6 text-center text-bone">
      <Symbol className="size-20 text-sand" />
      <div className="space-y-3">
        <h1 className="display text-4xl">This page does not exist.</h1>
        <p lang="ar" dir="rtl" className="font-[family-name:var(--font-arabic)] text-2xl text-sand">
          هذه الصفحة غير موجودة.
        </p>
      </div>
      <div className="flex gap-4 text-sm">
        <Link href="/en" className="border border-bone/30 px-6 py-3 hover:border-bone">
          Return home
        </Link>
        <Link href="/ar" lang="ar" className="border border-bone/30 px-6 py-3 font-[family-name:var(--font-arabic)] hover:border-bone">
          العودة إلى الرئيسية
        </Link>
      </div>
    </main>
  );
}
