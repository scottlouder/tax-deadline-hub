import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | TaxDeadlineHub",
  description: "The page you were looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-6xl font-bold text-[#1e3a5f]">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">
          Page Not Found
        </h1>
        <p className="mt-3 max-w-md text-sm text-slate-600">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved. Try one of the links below to find what you need.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-[#1e3a5f] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#16304d]"
        >
          Back to Homepage
        </Link>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          <Link
            href="/#states"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Browse by State
          </Link>
          <Link
            href="/#entity-types"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Entity Types
          </Link>
          <Link
            href="/estimated-payments"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Estimated Payments
          </Link>
          <Link
            href="/calculators"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Calculators
          </Link>
        </div>
      </div>
    </div>
  );
}
