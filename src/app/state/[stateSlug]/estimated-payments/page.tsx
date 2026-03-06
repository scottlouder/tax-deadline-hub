import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import EstimatedPaymentCalendar from "../../../../components/EstimatedPaymentCalendar";
import FAQSection from "../../../../components/FAQSection";
import {
  entityTypes,
  federalDeadlines,
  getStateBySlug,
  getStateDeadlineBySlug,
  states,
} from "../../../../lib/data";
import { formatDate } from "../../../../lib/dates";

export const generateStaticParams = () =>
  states.map((state) => ({ stateSlug: state.slug }));

type PageParams = { stateSlug: string };
type PageProps = { params: Promise<PageParams> };

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  const title = state
    ? `${state.name} Estimated Tax Payments 2026 | Quarterly Due Dates | TaxDeadlineHub`
    : "State Estimated Tax Payments | TaxDeadlineHub";
  const description = state
    ? `${state.name} quarterly estimated tax payment due dates for 2026. Federal and state schedules for individuals, corporations, and S-corps.`
    : "State estimated tax payment due dates for 2026.";
  return { title, description };
};

export default async function StateEstimatedPaymentsPage({ params }: PageProps) {
  const { stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  const stateData = getStateDeadlineBySlug(stateSlug);

  if (!state || !stateData) {
    return <div className="text-sm text-slate-600">State not found.</div>;
  }

  const deadlinesWithEstimates = stateData.deadlines.filter(
    (d) => d.estimatedPayments.length > 0
  );
  const deadlinesWithoutEstimates = stateData.deadlines.filter(
    (d) => d.estimatedPayments.length === 0
  );

  // Find federal dates for comparison
  const federalSoleProp = federalDeadlines.entityDeadlines.find(
    (d) => d.entityType === "sole-proprietorship"
  );
  const federalEstDates = federalSoleProp?.estimatedDates ?? [];

  const faqItems = [
    {
      question: `Does ${state.name} require estimated tax payments?`,
      answer: deadlinesWithEstimates.length > 0
        ? `Yes. ${state.name} requires estimated payments for ${deadlinesWithEstimates
            .map((d) => entityTypes.find((e) => e.slug === d.entityType)?.name ?? d.entityType)
            .join(", ")}.`
        : `${state.name} ${state.hasIncomeTax ? "does not appear to require entity-level estimated payments for the listed entity types, but individual owners may still owe estimates. Check with" : "does not have an income tax. Consult"} ${state.taxAgency.name} for details.`,
    },
    {
      question: `Are ${state.name} estimated payment dates the same as federal?`,
      answer: deadlinesWithEstimates.length > 0
        ? (() => {
            const first = deadlinesWithEstimates[0];
            const matchesFederal =
              first.estimatedPayments.length === federalEstDates.length &&
              first.estimatedPayments.every((d, i) => d === federalEstDates[i]);
            return matchesFederal
              ? `Yes, ${state.name} follows the same quarterly schedule as the federal government for most entity types.`
              : `${state.name} has its own estimated payment schedule that may differ from federal dates. Compare the dates below carefully.`;
          })()
        : `Not applicable — ${state.name} does not require estimated payments at the entity level for most filers.`,
    },
    {
      question: `What form do I use for ${state.name} estimated payments?`,
      answer: `Contact ${state.taxAgency.name} at ${state.taxAgency.url} for the correct estimated payment voucher and instructions.`,
    },
  ];

  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Estimated Payments", href: "/estimated-payments" },
          { label: state.name, href: `/state/${state.slug}` },
          { label: "Estimated Payments" },
        ]}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              {state.name} Estimated Tax Payments
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {deadlinesWithEstimates.length > 0
                ? `Quarterly estimated payment schedule for ${state.name} in 2026, with federal comparison.`
                : state.hasIncomeTax
                  ? `${state.name} does not list entity-level estimated payment requirements for the covered entity types.`
                  : `${state.name} does not levy an individual income tax.`}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{state.taxAgency.name}</p>
            <p className="text-xs">{state.taxAgency.url}</p>
          </div>
        </div>
      </section>

      {/* Federal Reference */}
      {federalEstDates.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Federal Schedule (Reference)</h2>
          <EstimatedPaymentCalendar
            title="Federal Individual Estimated Payments (Form 1040-ES)"
            dates={federalEstDates}
          />
        </section>
      )}

      {/* State Estimated Payments by Entity */}
      {deadlinesWithEstimates.length > 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {state.name} Estimated Payment Schedule
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Quarterly dates by entity type. Dates matching the federal schedule are noted.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {deadlinesWithEstimates.map((deadline) => {
              const entity = entityTypes.find((e) => e.slug === deadline.entityType);
              const matchesFederal =
                deadline.estimatedPayments.length === federalEstDates.length &&
                deadline.estimatedPayments.every((d, i) => d === federalEstDates[i]);

              return (
                <div key={deadline.entityType} className="space-y-2">
                  <EstimatedPaymentCalendar
                    title={entity?.name ?? deadline.entityType}
                    dates={deadline.estimatedPayments}
                  />
                  {matchesFederal && (
                    <p className="pl-1 text-xs text-emerald-600 font-semibold">
                      Matches federal schedule
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Comparison Table */}
      {deadlinesWithEstimates.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Federal vs. {state.name} Comparison
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-3 pr-4 font-semibold text-slate-500">Quarter</th>
                  <th className="pb-3 pr-4 font-semibold text-slate-500">Federal</th>
                  <th className="pb-3 pr-4 font-semibold text-slate-500">{state.name}</th>
                  <th className="pb-3 pr-4 font-semibold text-slate-500">Match?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deadlinesWithEstimates[0].estimatedPayments.map((stateDate, i) => {
                  const fedDate = federalEstDates[i] ?? null;
                  const matches = fedDate === stateDate;
                  return (
                    <tr key={stateDate}>
                      <td className="py-3 pr-4 font-semibold text-slate-900">Q{i + 1}</td>
                      <td className="py-3 pr-4 text-slate-600">{fedDate ? formatDate(fedDate) : "N/A"}</td>
                      <td className="py-3 pr-4 font-semibold text-slate-900">{formatDate(stateDate)}</td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${matches ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {matches ? "Same" : "Different"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Entity types without estimated payments */}
      {deadlinesWithoutEstimates.length > 0 && (
        <section className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Entity Types Without State Estimated Payments
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            The following entity types do not have state-level estimated payment requirements listed for {state.name}:
          </p>
          <ul className="mt-3 space-y-1">
            {deadlinesWithoutEstimates.map((d) => {
              const entity = entityTypes.find((e) => e.slug === d.entityType);
              return (
                <li key={d.entityType} className="text-sm text-slate-600">
                  <Link
                    href={`/state/${state.slug}/${d.entityType}`}
                    className="font-semibold text-blue-700 hover:underline"
                  >
                    {entity?.name ?? d.entityType}
                  </Link>
                  {" "}— {d.notes || "Check with state agency for details."}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Back links */}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/state/${state.slug}`}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          All {state.name} Deadlines
        </Link>
        <Link
          href="/estimated-payments"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          All States Estimated Payments
        </Link>
      </div>

      <FAQSection faqs={faqItems} />
    </div>
  );
}
