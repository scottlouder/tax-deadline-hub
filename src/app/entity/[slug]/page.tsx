import { Metadata } from "next";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DeadlineCard from "../../../components/DeadlineCard";
import FAQSection from "../../../components/FAQSection";
import Link from "next/link";
import {
  entityTypes,
  federalDeadlines,
  getEntityBySlug,
  getStateBySlug,
  stateDeadlines,
} from "../../../lib/data";
import { formatDate } from "../../../lib/dates";

export const generateStaticParams = () =>
  entityTypes.map((entity) => ({ slug: entity.slug }));

type PageParams = { slug: string };
type PageProps = { params: Promise<PageParams> };

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const entity = getEntityBySlug(slug);
  const title = entity
    ? `${entity.name} Tax Deadlines 2026 | TaxDeadlineHub`
    : "Entity Tax Deadlines | TaxDeadlineHub";
  const description = entity
    ? `Federal and state filing dates, extensions, and estimates for ${entity.name} in 2026.`
    : "Entity tax deadlines for 2026.";
  return {
    title,
    description,
    alternates: { canonical: `/entity/${slug}` },
    openGraph: {
      title,
      description,
      url: `/entity/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

export default async function EntityPage({ params }: PageProps) {
  const { slug } = await params;
  const entity = getEntityBySlug(slug);
  const federal = federalDeadlines.entityDeadlines.find(
    (item) => item.entityType === slug
  );

  if (!entity || !federal) {
    return <div className="text-sm text-slate-600">Entity type not found.</div>;
  }

  const stateComparison = stateDeadlines.map((state) => {
    const entry = state.deadlines.find((deadline) => deadline.entityType === slug);
    return {
      stateName: state.stateName,
      stateSlug: state.stateSlug,
      dueDate: entry?.dueDate ?? null,
      extensionDate: entry?.extensionDate ?? null,
      hasIncomeTax: state.hasIncomeTax,
    };
  });

  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Entity Types", href: "/#entities" },
          { label: entity.name },
        ]}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{entity.name} Tax Deadlines</h1>
        <p className="mt-2 text-sm text-slate-600">{entity.description}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <DeadlineCard
          title="Federal return"
          dueDate={federal.dueDate}
          extensionDate={federal.extensionDate}
          description={entity.deadlineInfo}
          form={federal.form}
          notes={federal.notes}
        />
        <DeadlineCard
          title="Estimated taxes"
          dueDate={federal.estimatedDates?.[0] ?? null}
          extensionDate={null}
          description={
            federal.estimatedDates?.length
              ? `Quarterly estimates: ${federal.estimatedDates.map(formatDate).join(", ")}.`
              : "Estimated payments are generally not required at the entity level."
          }
          form={federal.entityType === "sole-proprietorship" ? "Form 1040-ES" : null}
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">State comparison</h2>
        <p className="mt-2 text-sm text-slate-600">
          Select a state to see the detailed deadline page.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {stateComparison.map((state) => (
            <div
              key={state.stateSlug}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between">
                <Link
                  href={`/state/${state.stateSlug}/${entity.slug}`}
                  className="text-sm font-semibold text-blue-800"
                >
                  {state.stateName}
                </Link>
                <span className="text-xs text-slate-500">
                  {state.hasIncomeTax ? "Income tax" : "No income tax"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Due: {formatDate(state.dueDate)}
              </p>
              <p className="text-xs text-slate-500">
                Extension: {formatDate(state.extensionDate)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links to Popular States */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          Popular States for {entity.name}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Quick links to {entity.name.toLowerCase()} tax deadlines in the most-searched states.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {(["california", "texas", "new-york", "florida", "pennsylvania", "ohio", "illinois", "new-jersey", "massachusetts", "missouri"] as const).map((stateSlug) => {
            const s = getStateBySlug(stateSlug);
            if (!s) return null;
            return (
              <div key={s.slug} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                <Link
                  href={`/state/${s.slug}/${entity.slug}`}
                  className="font-semibold text-blue-800 hover:underline"
                >
                  {s.name}
                </Link>
                <div className="mt-1 flex flex-col gap-0.5">
                  <Link href={`/state/${s.slug}`} className="text-xs text-slate-500 hover:text-blue-700">
                    All {s.name} Deadlines
                  </Link>
                  <Link href={`/state/${s.slug}/estimated-payments`} className="text-xs text-slate-500 hover:text-blue-700">
                    Estimated Payments
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <FAQSection />
    </div>
  );
}
