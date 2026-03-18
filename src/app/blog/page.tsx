import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tax Deadline Blog & Guides | TaxDeadlineHub",
  description:
    "In-depth guides to federal and state tax deadlines, estimated payments, and filing requirements for 2026. Expert tax deadline resources for individuals and businesses.",
  keywords: [
    "tax deadline blog",
    "tax filing guides",
    "2026 tax deadlines",
    "estimated tax payments guide",
    "state tax deadlines",
    "c corp tax deadlines",
  ],
  alternates: {
    canonical: "https://taxdeadlinehub.com/blog",
  },
};

const articles = [
  {
    slug: "2026-federal-tax-deadlines",
    title: "Complete Guide to 2026 Federal Tax Deadlines",
    description:
      "Every federal tax deadline for the 2026 filing season — individual returns, business returns, extensions, and quarterly estimated payments.",
    date: "2026-01-15",
    category: "Federal",
  },
  {
    slug: "estimated-tax-payments-guide",
    title: "Estimated Tax Payments Guide for 2026: Who Pays, When & How",
    description:
      "Everything you need to know about quarterly estimated tax payments — who must pay, how to calculate, deadlines, and penalties for underpayment.",
    date: "2026-01-20",
    category: "Federal",
  },
  {
    slug: "state-tax-filing-deadlines-2026",
    title: "2026 State Tax Filing Deadlines: All 50 States",
    description:
      "A state-by-state breakdown of individual and business tax filing deadlines for the 2026 tax year.",
    date: "2026-01-25",
    category: "State",
  },
  {
    slug: "c-corp-tax-deadlines-2026",
    title: "C-Corp Tax Deadlines 2026: Complete Filing Guide",
    description:
      "All C-Corporation (Form 1120) tax deadlines for 2026, including estimated payments, extensions, and state-specific due dates.",
    date: "2026-02-01",
    category: "Business",
  },
  {
    slug: "utah-estimated-tax-payments",
    title: "Does Utah Require Estimated Tax Payments? Yes — Here\u2019s What to Know",
    description:
      "Utah requires estimated tax payments if you expect to owe $1,000 or more. Learn payment dates, calculation methods, and penalties.",
    date: "2026-02-05",
    category: "State",
  },
  {
    slug: "florida-business-tax-guide",
    title: "Florida Business Tax Guide 2026: Corporate Filing, S-Corps & More",
    description:
      "Florida has no individual income tax but does impose a 5.5% corporate income tax. Learn about C-Corp filing, S-Corp treatment, and sales tax.",
    date: "2026-02-10",
    category: "State",
  },
  {
    slug: "iowa-tax-deadlines-2026",
    title: "Iowa Tax Deadlines 2026: Individual, Business & Estimated Payments",
    description:
      "All Iowa state tax deadlines for 2026, including individual filing, business returns, and quarterly estimated payment dates.",
    date: "2026-02-15",
    category: "State",
  },
  {
    slug: "massachusetts-tax-deadlines-2026",
    title: "Massachusetts Tax Deadlines 2026: Filing Dates, Surtax & Key Rules",
    description:
      "Massachusetts tax deadlines for 2026, including the 4% millionaire surtax, individual and business filing dates, and estimated payments.",
    date: "2026-02-20",
    category: "State",
  },
];

export default function BlogIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "TaxDeadlineHub Blog",
    url: "https://taxdeadlinehub.com/blog",
    description:
      "In-depth guides to federal and state tax deadlines, estimated payments, and filing requirements for 2026.",
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Blog
        </p>
        <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
          Tax Deadline Guides & Resources
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          In-depth guides to help you understand and meet every federal and state
          tax deadline for the 2026 filing season.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-semibold text-blue-700">
                {article.category}
              </span>
              <time className="text-slate-400" dateTime={article.date}>
                {new Date(article.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-blue-700">
              {article.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
