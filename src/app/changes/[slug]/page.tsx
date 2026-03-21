import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "../../../components/Breadcrumbs";
import FAQSection from "../../../components/FAQSection";
import {
  getAllTaxChanges,
  getAllTaxChangeSlugs,
  getTaxChangeBySlug,
} from "../../../lib/tax-changes";
import { formatDate, daysUntil, urgencyLabel, urgencyClass } from "../../../lib/dates";

export const generateStaticParams = () =>
  getAllTaxChangeSlugs().map((slug) => ({ slug }));

type PageParams = { slug: string };
type PageProps = { params: Promise<PageParams> };

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const change = getTaxChangeBySlug(slug);
  if (!change)
    return { title: "Tax Change Not Found | TaxDeadlineHub" };

  return {
    title: `${change.title} | TaxDeadlineHub`,
    description: change.description,
    keywords: change.targetKeywords,
    alternates: { canonical: `https://taxdeadlinehub.com/changes/${slug}` },
    openGraph: {
      title: change.title,
      description: change.description,
      url: `https://taxdeadlinehub.com/changes/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: change.title,
      description: change.description,
    },
  };
};

export default async function TaxChangePage({ params }: PageProps) {
  const { slug } = await params;
  const change = getTaxChangeBySlug(slug);
  if (!change) notFound();

  const allChanges = getAllTaxChanges();
  const relatedChanges = allChanges.filter((c) => c.slug !== slug);
  const daysToDeadline = daysUntil("2026-04-15");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: change.title,
      description: change.description,
      url: `https://taxdeadlinehub.com/changes/${slug}`,
      publisher: {
        "@type": "Organization",
        name: "TaxDeadlineHub",
        url: "https://taxdeadlinehub.com",
      },
      datePublished: "2026-01-15",
      dateModified: new Date().toISOString().split("T")[0],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: change.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://taxdeadlinehub.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "2026 Tax Changes",
          item: "https://taxdeadlinehub.com/changes",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: change.shortTitle,
          item: `https://taxdeadlinehub.com/changes/${slug}`,
        },
      ],
    },
  ];

  return (
    <div className="space-y-10">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "2026 Tax Changes", href: "/changes" },
          { label: change.shortTitle },
        ]}
      />

      <section className="rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-blue-800 p-8 text-white shadow-xl">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-100">
            2026 Filing Season Change
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            {change.title}
          </h1>
          <p className="text-base text-amber-50">{change.description}</p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold">
              Claim via: {change.claimMethod}
            </span>
            {daysToDeadline !== null && daysToDeadline > 0 && (
              <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold">
                {daysToDeadline} days until deadline
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Who Qualifies
        </h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          {change.eligibility}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Key Facts</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {change.keyFacts.map((fact, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm text-slate-700">{fact}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Important Deadlines
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {change.relatedDeadlines.map((deadline, i) => {
            const days = daysUntil(deadline.date);
            const label = urgencyLabel(days);
            const cls = urgencyClass(days);
            return (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-slate-900">
                    {formatDate(deadline.date)}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}
                  >
                    {label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {deadline.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <FAQSection faqs={change.faqs} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Other 2026 Tax Changes
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {relatedChanges.map((related) => (
            <Link
              key={related.slug}
              href={`/changes/${related.slug}`}
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="font-semibold text-slate-900 group-hover:text-blue-800">
                {related.shortTitle}
              </p>
              <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                {related.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex justify-center">
        <Link
          href="/changes"
          className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          ← All 2026 Tax Changes
        </Link>
      </div>
    </div>
  );
}
