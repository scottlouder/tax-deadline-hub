import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import EstimatedPaymentCalendar from "../../components/EstimatedPaymentCalendar";
import FAQSection from "../../components/FAQSection";
import { entityTypes, federalDeadlines, states, stateDeadlines } from "../../lib/data";

export const metadata: Metadata = {
  title: "2026 Estimated Tax Payment Due Dates | Quarterly Schedule | TaxDeadlineHub",
  description:
    "Complete 2026 quarterly estimated tax payment schedule for federal and all 50 states. Know exactly when your Q1, Q2, Q3, and Q4 estimated payments are due.",
  keywords: [
    "estimated tax payments 2026",
    "quarterly estimated tax due dates",
    "when are estimated taxes due",
    "1040-ES due dates",
    "quarterly tax payments schedule",
  ],
};

export default function EstimatedPaymentsPage() {
  const federalEntities = federalDeadlines.entityDeadlines.filter(
    (d) => d.estimatedDates.length > 0
  );

  const statesWithEstimates = states.filter((state) => {
    const sd = stateDeadlines.find((s) => s.stateSlug === state.slug);
    return sd?.deadlines.some((d) => d.estimatedPayments.length > 0);
  });

  const statesWithoutIncomeTax = states.filter((s) => !s.hasIncomeTax);

  const faqItems = [
    {
      question: "Who needs to make estimated tax payments?",
      answer:
        "If you expect to owe $1,000 or more in federal tax after subtracting withholding and credits, you generally must make estimated payments. This applies to self-employed individuals, freelancers, landlords, investors, and anyone with significant non-wage income.",
    },
    {
      question: "What are the 2026 federal estimated tax payment due dates?",
      answer:
        "For tax year 2026, federal estimated payments are due: Q1 on April 15, 2026; Q2 on June 15, 2026; Q3 on September 15, 2026; and Q4 on January 15, 2027.",
    },
    {
      question: "What happens if I miss an estimated tax payment?",
      answer:
        "The IRS charges an underpayment penalty calculated on the amount you underpaid for each quarter. The penalty rate is the federal short-term rate plus 3 percentage points, compounded daily. Even a partial payment reduces the penalty.",
    },
    {
      question: "Do all states require estimated tax payments?",
      answer: `No. States without an individual income tax (${statesWithoutIncomeTax.map((s) => s.name).join(", ")}) do not require estimated payments. Most other states follow a quarterly schedule similar to the federal calendar.`,
    },
    {
      question: "How do I calculate my estimated tax payments?",
      answer:
        "Use IRS Form 1040-ES. You can base payments on 100% of last year's tax liability (110% if AGI exceeds $150,000) or 90% of your expected current-year liability, whichever is smaller. Divide by 4 for equal quarterly payments.",
    },
  ];

  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Estimated Payments" },
        ]}
      />

      <section className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-8 text-white shadow-xl">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
            Quarterly Schedule
          </p>
          <h1 className="text-4xl font-semibold md:text-5xl">
            2026 Estimated Tax Payment Due Dates
          </h1>
          <p className="text-base text-blue-100">
            Federal and state quarterly estimated payment deadlines for individuals,
            corporations, and S-corps. Never miss a payment or face underpayment penalties.
          </p>
        </div>
      </section>

      {/* Federal Estimated Payments */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Federal Estimated Payment Schedule
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Quarterly payment dates by entity type for tax year 2025 (filed in 2026).
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {federalEntities.map((entry) => {
            const entity = entityTypes.find((e) => e.slug === entry.entityType);
            return (
              <EstimatedPaymentCalendar
                key={entry.entityType}
                title={`${entity?.name ?? entry.entityType} (${entry.form})`}
                dates={entry.estimatedDates}
              />
            );
          })}
        </div>
      </section>

      {/* Quick Reference Table */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          2026 Federal Quarterly Due Dates at a Glance
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="pb-3 pr-4 font-semibold text-slate-500">Quarter</th>
                <th className="pb-3 pr-4 font-semibold text-slate-500">Period Covered</th>
                <th className="pb-3 pr-4 font-semibold text-slate-500">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 pr-4 font-semibold text-slate-900">Q1</td>
                <td className="py-3 pr-4 text-slate-600">Jan 1 - Mar 31</td>
                <td className="py-3 pr-4 font-semibold text-slate-900">April 15, 2026</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-slate-900">Q2</td>
                <td className="py-3 pr-4 text-slate-600">Apr 1 - May 31</td>
                <td className="py-3 pr-4 font-semibold text-slate-900">June 15, 2026</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-slate-900">Q3</td>
                <td className="py-3 pr-4 text-slate-600">Jun 1 - Aug 31</td>
                <td className="py-3 pr-4 font-semibold text-slate-900">September 15, 2026</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-slate-900">Q4</td>
                <td className="py-3 pr-4 text-slate-600">Sep 1 - Dec 31</td>
                <td className="py-3 pr-4 font-semibold text-slate-900">January 15, 2027</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* States Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            State Estimated Payment Schedules
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {statesWithEstimates.length} states require estimated tax payments. Click a state for
            its full quarterly schedule.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {states.map((state) => {
            const hasEstimates = statesWithEstimates.some((s) => s.slug === state.slug);
            return (
              <Link
                key={state.slug}
                href={`/state/${state.slug}/estimated-payments`}
                className={`rounded-xl border p-3 text-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  hasEstimates
                    ? "border-slate-200 bg-white shadow-sm"
                    : "border-slate-100 bg-slate-50 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${hasEstimates ? "text-slate-900" : "text-slate-400"}`}>
                    {state.name}
                  </span>
                  <span className="text-xs text-slate-500">{state.abbreviation}</span>
                </div>
                {!hasEstimates && (
                  <p className="mt-1 text-xs">No income tax</p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <FAQSection faqs={faqItems} />
    </div>
  );
}
