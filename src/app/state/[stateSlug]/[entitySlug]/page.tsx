import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import DeadlineCard from "../../../../components/DeadlineCard";
import FAQSection from "../../../../components/FAQSection";
import {
  entityTypes,
  getEntityBySlug,
  getNeighboringStates,
  getStateBySlug,
  getStateDeadlineBySlug,
  getStateEntityDeadline,
  states,
} from "../../../../lib/data";
import { formatDate } from "../../../../lib/dates";

export const generateStaticParams = () =>
  states.flatMap((state) =>
    entityTypes.map((entity) => ({
      stateSlug: state.slug,
      entitySlug: entity.slug,
    }))
  );

type PageParams = { stateSlug: string; entitySlug: string };
type PageProps = { params: Promise<PageParams> };

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { stateSlug, entitySlug } = await params;
  const state = getStateBySlug(stateSlug);
  const entity = getEntityBySlug(entitySlug);
  const title = state && entity
    ? `${state.name} ${entity.name} Tax Deadlines 2026 — Filing Dates, Extensions & Estimates | TaxDeadlineHub`
    : "State Entity Tax Deadlines | TaxDeadlineHub";
  const description = state && entity
    ? `Complete ${state.name} ${entity.name} tax deadline guide for 2026. Filing due dates, extension deadlines, estimated payment schedule, required forms, and penalties. Updated for the current tax year.`
    : "State and entity tax deadlines for 2026.";
  return {
    title,
    description,
    alternates: { canonical: `/state/${stateSlug}/${entitySlug}` },
    openGraph: {
      title,
      description,
      url: `/state/${stateSlug}/${entitySlug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

export default async function StateEntityPage({ params }: PageProps) {
  const { stateSlug, entitySlug } = await params;
  const state = getStateBySlug(stateSlug);
  const entity = getEntityBySlug(entitySlug);
  const deadline = getStateEntityDeadline(stateSlug, entitySlug);

  if (!state || !entity || !deadline) {
    return <div className="text-sm text-slate-600">Deadline not found.</div>;
  }

  const stateDeadline = getStateDeadlineBySlug(stateSlug);
  const neighboringStates = getNeighboringStates(stateSlug);
  const otherEntities = entityTypes.filter((e) => e.slug !== entitySlug);

  const faqItems = [
    {
      question: `When is the ${entity.name} tax filing deadline in ${state.name} for 2026?`,
      answer: deadline.dueDate
        ? `The ${state.name} ${entity.name} tax return is due ${formatDate(deadline.dueDate)} for the 2026 tax year. ${deadline.extensionDate ? `An extension is available until ${formatDate(deadline.extensionDate)}.` : ""}`
        : `${state.name} does not have a separate state filing requirement for ${entity.name} entities. Check with ${state.taxAgency.name} for the latest information.`,
    },
    {
      question: `Does ${state.name} require ${entity.name} estimated tax payments?`,
      answer: deadline.estimatedPayments.length
        ? `Yes, ${state.name} requires estimated tax payments for ${entity.name} entities. The quarterly due dates are: ${deadline.estimatedPayments
            .map((date) => formatDate(date))
            .join(", ")}. Penalties may apply if you underpay or miss a deadline.`
        : `Estimated payments are not typically required at the entity level for ${entity.name} in ${state.name}, but confirm with ${state.taxAgency.name}.`,
    },
    {
      question: `What form do I file for a ${entity.name} in ${state.name}?`,
      answer: deadline.returnForm
        ? `${entity.name} entities in ${state.name} file using Form ${deadline.returnForm}. You can download the form from ${state.taxAgency.name} at ${state.taxAgency.url}.`
        : `Contact ${state.taxAgency.name} at ${state.taxAgency.url} for the correct form for ${entity.name} filings in ${state.name}.`,
    },
    {
      question: `Can I get an extension for my ${state.name} ${entity.name} tax return?`,
      answer: deadline.extensionDate
        ? `Yes. ${state.name} allows an extension for ${entity.name} returns until ${formatDate(deadline.extensionDate)}. Note that an extension gives you more time to file, not more time to pay — any tax owed is still due by the original deadline of ${deadline.dueDate ? formatDate(deadline.dueDate) : "the original due date"}.`
        : `Check with ${state.taxAgency.name} for extension options for ${entity.name} entities in ${state.name}.`,
    },
    {
      question: `What are the penalties for filing late in ${state.name}?`,
      answer: `${state.name} typically charges a failure-to-file penalty (usually 5% of unpaid tax per month, up to 25%) and a failure-to-pay penalty (usually 0.5-1% per month). Interest also accrues on unpaid balances. Filing for an extension by the original deadline avoids the failure-to-file penalty but not the failure-to-pay penalty.`,
    },
    {
      question: `Where can I file ${state.name} ${entity.name} taxes?`,
      answer: `File through ${state.taxAgency.name}. Visit ${state.taxAgency.url} for e-filing options, downloadable forms, and payment portals.`,
    },
  ];

  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "States", href: "/#states" },
          { label: state.name, href: `/state/${state.slug}` },
          { label: entity.name },
        ]}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">
          {state.name} {entity.name} Tax Deadlines 2026
        </h1>
        <p className="mt-2 text-slate-600">
          Complete guide to {entity.name} filing dates, extensions, estimated payment schedules,
          and required forms in {state.name} for the 2026 tax year. {state.hasIncomeTax
            ? `${state.name} imposes a state income tax, so ${entity.name} entities must file both federal and state returns.`
            : `${state.name} does not have a state income tax, so ${entity.name} entities only need to file federal returns.`}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <DeadlineCard
          title={`${state.name} ${entity.name} filing deadline`}
          dueDate={deadline.dueDate}
          extensionDate={deadline.extensionDate}
          description={deadline.notes}
          form={deadline.returnForm}
        />
        <DeadlineCard
          title="Estimated payments"
          dueDate={deadline.estimatedPayments[0] ?? null}
          extensionDate={null}
          description={
            deadline.estimatedPayments.length
              ? `Quarterly estimated payment dates: ${deadline.estimatedPayments
                  .map((date) => formatDate(date))
                  .join(", ")}.`
              : "No state estimated payment schedule listed."
          }
        />
      </section>

      {/* Key deadlines summary */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          {state.name} {entity.name} Tax Calendar at a Glance
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="pb-2 font-semibold text-slate-900">Event</th>
                <th className="pb-2 font-semibold text-slate-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deadline.dueDate && (
                <tr>
                  <td className="py-2 text-slate-700">Filing deadline</td>
                  <td className="py-2 text-slate-900 font-medium">{formatDate(deadline.dueDate)}</td>
                </tr>
              )}
              {deadline.extensionDate && (
                <tr>
                  <td className="py-2 text-slate-700">Extension deadline</td>
                  <td className="py-2 text-slate-900 font-medium">{formatDate(deadline.extensionDate)}</td>
                </tr>
              )}
              {deadline.estimatedPayments.map((date, i) => (
                <tr key={date}>
                  <td className="py-2 text-slate-700">Q{i + 1} estimated payment</td>
                  <td className="py-2 text-slate-900 font-medium">{formatDate(date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <FAQSection faqs={faqItems} />

      {/* Internal linking: estimated payments */}
      {state.hasIncomeTax && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            {state.name} Estimated Tax Payments
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            View the full quarterly estimated payment schedule for {state.name}, including
            all entity types and payment methods.
          </p>
          <Link
            href={`/state/${state.slug}/estimated-payments`}
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View {state.name} estimated payments →
          </Link>
        </section>
      )}

      {/* Internal linking: other entity types */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Other Entity Types in {state.name}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {otherEntities.map((e) => (
            <Link
              key={e.slug}
              href={`/state/${state.slug}/${e.slug}`}
              className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600"
            >
              {e.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Internal linking: neighboring states */}
      {neighboringStates.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            {entity.name} Deadlines in Neighboring States
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {neighboringStates.map((ns) => (
              <Link
                key={ns.slug}
                href={`/state/${ns.slug}/${entitySlug}`}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600"
              >
                {ns.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
