import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DeadlineCard from "../../../components/DeadlineCard";
import FAQSection from "../../../components/FAQSection";
import {
  getStateBySlug,
  getStateDeadlineBySlug,
  states,
  entityTypes,
} from "../../../lib/data";

export const generateStaticParams = () =>
  states.map((state) => ({ stateSlug: state.slug }));

type PageParams = { stateSlug: string };
type PageProps = { params: Promise<PageParams> };

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { stateSlug: slug } = await params;
  const state = getStateBySlug(slug);
  const title = state
    ? `${state.name} Tax Deadlines 2026 | TaxDeadlineHub`
    : "State Tax Deadlines | TaxDeadlineHub";
  const description = state
    ? `Federal and ${state.name} state tax deadlines, extensions, and estimated payments for 2026.`
    : "State tax deadlines for 2026.";
  return {
    title,
    description,
    alternates: { canonical: `/state/${slug}` },
    openGraph: {
      title,
      description,
      url: `/state/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

export default async function StatePage({ params }: PageProps) {
  const { stateSlug: slug } = await params;
  const state = getStateBySlug(slug);
  const stateData = getStateDeadlineBySlug(slug);

  if (!state || !stateData) {
    return <div className="text-sm text-slate-600">State not found.</div>;
  }

  const faqItems = [
    {
      question: `Does ${state.name} conform to federal due dates?`,
      answer: state.hasIncomeTax
        ? `Many ${state.name} deadlines follow the federal calendar. Always confirm on ${state.taxAgency.name}.`
        : `${state.name} does not levy an individual income tax, so most income tax deadlines are not applicable.`,
    },
    {
      question: `Where can I file ${state.name} tax forms?`,
      answer: `Visit ${state.taxAgency.name} at ${state.taxAgency.url} for official forms and e-file options.`,
    },
  ];

  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "States", href: "/#states" },
          { label: state.name },
        ]}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              {state.name} Tax Deadlines
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {state.hasIncomeTax
                ? "State income tax filing deadlines, extensions, and estimates for 2026."
                : "No state income tax. Review business and other tax obligations with the state agency."}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{state.taxAgency.name}</p>
            <p className="text-xs">{state.taxAgency.url}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {stateData.deadlines.map((deadline) => {
          const entityLabel =
            entityTypes.find((entity) => entity.slug === deadline.entityType)?.name ??
            deadline.entityType;
          return (
            <DeadlineCard
              key={`${state.slug}-${deadline.entityType}`}
              title={`${entityLabel} deadline`}
              dueDate={deadline.dueDate}
              extensionDate={deadline.extensionDate}
              form={deadline.returnForm}
              notes={deadline.notes}
              estimatedDates={deadline.estimatedPayments}
            />
          );
        })}
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900">Estimated Tax Payments</p>
            <p className="mt-1 text-sm text-slate-600">
              View all quarterly estimated payment due dates for {state.name}.
            </p>
          </div>
          <Link
            href={`/state/${state.slug}/estimated-payments`}
            className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            View Schedule
          </Link>
        </div>
      </section>

      <FAQSection faqs={faqItems} />
    </div>
  );
}
