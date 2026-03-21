import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import FAQSection from "../../components/FAQSection";
import { getAllTaxChanges } from "../../lib/tax-changes";
import { daysUntil } from "../../lib/dates";

export const metadata: Metadata = {
  title: "2026 Filing Season Tax Changes — One Big Beautiful Bill | TaxDeadlineHub",
  description:
    "Complete guide to new tax changes affecting 2025 returns filed in 2026. Covers no tax on tips, no tax on overtime, Schedule 1-A, increased Child Tax Credit ($2,500), and enhanced senior standard deduction ($4,000 extra).",
  keywords: [
    "2026 tax law changes",
    "one big beautiful bill tax changes",
    "no tax on tips",
    "no tax on overtime",
    "schedule 1-a",
    "child tax credit 2025",
    "senior standard deduction 2025",
    "2026 filing season changes",
    "new tax provisions 2025",
  ],
  alternates: {
    canonical: "https://taxdeadlinehub.com/changes",
  },
};

const hubFaqs = [
  {
    question: "What new tax changes affect my 2025 return filed in 2026?",
    answer:
      "The One Big Beautiful Bill introduced several provisions effective for 2025: no federal income tax on tips (up to $25,000), no federal income tax on overtime pay for W-2 employees, a new Schedule 1-A form, the Child Tax Credit increasing to $2,500 per child, and an extra $4,000 standard deduction for taxpayers 65+.",
  },
  {
    question: "When is the deadline to file my 2025 return with these new provisions?",
    answer:
      "The standard deadline is April 15, 2026. If you file Form 4868 for an extension, the extended deadline is October 15, 2026. All new provisions from the One Big Beautiful Bill can be claimed on returns filed by either deadline.",
  },
  {
    question: "Do I need special tax software to claim the new tax changes?",
    answer:
      "All major tax software (TurboTax, H&R Block, FreeTaxUSA, TaxAct) has been updated for 2025 returns and includes support for Schedule 1-A, the higher Child Tax Credit, and the enhanced senior deduction. No special software is needed.",
  },
  {
    question: "Do states recognize the federal tax changes from the One Big Beautiful Bill?",
    answer:
      "It depends on the state. States that conform to federal adjusted gross income (AGI) may automatically reflect the tip and overtime exclusions. States with fixed conformity dates may require separate legislation. Check your state's tax deadline page for details.",
  },
];

export default function TaxChangesHub() {
  const changes = getAllTaxChanges();
  const daysToDeadline = daysUntil("2026-04-15");
  const individualChanges = changes.filter(
    (c) => c.slug !== "one-big-beautiful-bill-tax-changes"
  );
  const overview = changes.find(
    (c) => c.slug === "one-big-beautiful-bill-tax-changes"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "2026 Filing Season Tax Changes",
    description: metadata.description,
    url: "https://taxdeadlinehub.com/changes",
    isPartOf: {
      "@type": "WebSite",
      name: "TaxDeadlineHub",
      url: "https://taxdeadlinehub.com",
    },
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "2026 Tax Changes" },
        ]}
      />

      <section className="rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-blue-800 p-8 text-white shadow-xl">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-100">
            2026 Filing Season
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            New Tax Changes Affecting Your 2025 Return
          </h1>
          <p className="text-base text-amber-50">
            The One Big Beautiful Bill introduced major tax provisions — no tax
            on tips, no tax on overtime, a bigger Child Tax Credit, and more.
            Here&apos;s everything you need to know before the April 15 deadline.
          </p>
          {daysToDeadline !== null && daysToDeadline > 0 && (
            <p className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold">
              {daysToDeadline} days until April 15 filing deadline
            </p>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Key Tax Changes for 2025 Returns
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {individualChanges.map((change) => (
            <Link
              key={change.slug}
              href={`/changes/${change.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-lg font-semibold text-slate-900 group-hover:text-blue-800">
                {change.shortTitle}
              </p>
              <p className="mt-2 text-sm text-slate-600">{change.description}</p>
              <p className="mt-3 text-xs font-semibold text-blue-700">
                Claim via: {change.claimMethod}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {overview && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Link
            href={`/changes/${overview.slug}`}
            className="group block"
          >
            <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-800">
              {overview.shortTitle}: Full Overview
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {overview.description}
            </p>
            <p className="mt-3 text-sm font-semibold text-blue-700">
              Read the complete guide →
            </p>
          </Link>
        </section>
      )}

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Important Deadlines
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Filing Deadline</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">April 15, 2026</p>
            <p className="mt-1 text-xs text-slate-500">Standard deadline for 2025 returns</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Extension Deadline</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">October 15, 2026</p>
            <p className="mt-1 text-xs text-slate-500">With Form 4868 extension</p>
          </div>
        </div>
      </section>

      <FAQSection faqs={hubFaqs} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Related Resources</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/estimated-payments"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Estimated Payments Guide
          </Link>
          <Link
            href="/state/california"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            California Tax Deadlines
          </Link>
          <Link
            href="/state/new-york"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            New York Tax Deadlines
          </Link>
          <Link
            href="/state/texas"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Texas Tax Deadlines
          </Link>
        </div>
      </section>
    </div>
  );
}
