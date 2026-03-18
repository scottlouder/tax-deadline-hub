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
  getNeighboringStates,
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
  return {
    title,
    description,
    alternates: { canonical: `/state/${stateSlug}/estimated-payments` },
    openGraph: {
      title,
      description,
      url: `/state/${stateSlug}/estimated-payments`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
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

  const entityNamesWithEstimates = deadlinesWithEstimates
    .map((d) => entityTypes.find((e) => e.slug === d.entityType)?.name ?? d.entityType)
    .join(", ");

  const estimatedDatesSummary = deadlinesWithEstimates.length > 0
    ? deadlinesWithEstimates[0].estimatedPayments.map((d) => formatDate(d)).join(", ")
    : "";

  const faqItems = [
    {
      question: `Does ${state.name} require estimated tax payments?`,
      answer: deadlinesWithEstimates.length > 0
        ? `Yes. ${state.name} requires quarterly estimated tax payments for taxpayers who expect to owe ${state.hasIncomeTax ? "state income tax" : "taxes"} during the year. This applies to ${entityNamesWithEstimates}. If your expected tax liability exceeds the state's minimum threshold after accounting for withholding and credits, you are generally required to make estimated payments. Failure to pay estimated taxes can result in underpayment penalties and interest charges from ${state.taxAgency.name}.`
        : `${state.name} ${state.hasIncomeTax ? "does not appear to require entity-level estimated payments for the listed entity types, but individual owners may still owe estimates. Self-employed individuals, freelancers, and business owners receiving income not subject to withholding should check with" : "does not have an income tax, so state estimated payments are not required. However, you still need to make federal estimated payments if you expect to owe $1,000 or more in federal tax. Consult"} ${state.taxAgency.name} for details.`,
    },
    {
      question: `When are ${state.name} estimated tax payments due in 2026?`,
      answer: deadlinesWithEstimates.length > 0
        ? `${state.name} estimated tax payments for 2026 are due on the following dates: ${estimatedDatesSummary}. These quarterly payments cover income earned during each respective period. The first payment (Q1) covers January through March, Q2 covers April through May, Q3 covers June through August, and Q4 covers September through December. If a due date falls on a weekend or holiday, the payment is due the next business day.`
        : `${state.name} does not have state-level estimated tax payment due dates for most entity types. Federal estimated payments are due April 15, June 15, September 15, 2026, and January 15, 2027.`,
    },
    {
      question: `What happens if I miss an estimated tax payment in ${state.name}?`,
      answer: state.hasIncomeTax
        ? `If you miss an estimated tax payment in ${state.name}, you may be subject to an underpayment penalty. ${state.taxAgency.name} calculates this penalty based on the amount of underpayment, the period of underpayment, and the applicable interest rate. The penalty is typically assessed on Form ${stateData.deadlines[0]?.returnForm || "your state tax return"} when you file your annual return. To avoid penalties, ensure each quarterly payment meets the required threshold — generally the lesser of 90% of the current year's tax or 100% of the prior year's tax (110% for higher-income taxpayers).`
        : `Since ${state.name} does not levy a state income tax, there are no state-level estimated payment penalties. However, missing federal estimated payments can result in IRS underpayment penalties calculated on Form 2210.`,
    },
    {
      question: `How do I calculate ${state.name} estimated tax payments?`,
      answer: state.hasIncomeTax
        ? `To calculate your ${state.name} estimated tax payments: (1) Estimate your total expected ${state.name} taxable income for 2026. (2) Calculate the tax owed using current ${state.name} tax rates and brackets. (3) Subtract any expected withholding and credits. (4) Divide the remaining amount by four for equal quarterly payments. Alternatively, you can use the annualized income installment method if your income is not evenly distributed throughout the year. Visit ${state.taxAgency.name} at ${state.taxAgency.url} for official worksheets and calculators.`
        : `${state.name} does not have a state income tax, so state estimated tax calculations are not applicable. For federal estimated taxes, use IRS Form 1040-ES and its worksheet to calculate your quarterly payment amounts.`,
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
              ? `Yes, ${state.name} follows the same quarterly schedule as the federal government for most entity types. This makes it convenient to submit both federal and state estimated payments at the same time.`
              : `${state.name} has its own estimated payment schedule that may differ from federal dates. Compare the state and federal dates in the comparison table above to ensure you don't miss any deadlines.`;
          })()
        : `Not applicable — ${state.name} does not require estimated payments at the entity level for most filers.`,
    },
    {
      question: `What form do I use for ${state.name} estimated payments?`,
      answer: state.hasIncomeTax
        ? `${state.name} has its own estimated payment voucher form. Contact ${state.taxAgency.name} at ${state.taxAgency.url} for the correct form, instructions, and electronic payment options. Many states now offer online portals for making estimated payments directly.`
        : `Since ${state.name} does not have a state income tax, no state estimated payment form is required. For federal estimated payments, use IRS Form 1040-ES.`,
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

      {/* State-specific expanded content for top-performing pages */}
      {stateSlug === "pennsylvania" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Pennsylvania Estimated Tax Payments: Complete Guide
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-slate-600">
            <p>
              Pennsylvania imposes a flat 3.07% income tax rate on most types of taxable income, making estimated payment calculations relatively straightforward compared to states with progressive tax brackets. If you expect to owe more than $8,000 in PA income tax after subtracting withholding and credits, you are required to make quarterly estimated payments using Form PA-40 ES.
            </p>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Penalty for Underpayment</p>
              <p className="mt-2">
                Pennsylvania charges an underpayment penalty if you fail to pay at least 90% of your current year tax liability (or 100% of the prior year liability) through estimated payments and withholding. The penalty is calculated at an annual interest rate set by the Department of Revenue, applied to the underpaid amount for each quarter. For 2026, the interest rate is determined annually and published by the Pennsylvania Department of Revenue.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Safe Harbor Rules</p>
              <p className="mt-2">
                To avoid the underpayment penalty in Pennsylvania, you can meet the safe harbor by paying at least 100% of your prior year&apos;s tax liability through estimated payments and withholding, or by paying at least 90% of your current year&apos;s tax liability. Pennsylvania does not have a separate 110% safe harbor threshold for high-income earners like the federal system. If you use the annualized income installment method, you may reduce or eliminate the penalty for quarters where income was lower.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Payment Methods</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li><strong>Online via myPATH:</strong> Pennsylvania&apos;s online portal at mypath.pa.gov allows electronic payments via bank account (ACH debit) at no charge.</li>
                <li><strong>Credit/Debit Card:</strong> Available through approved third-party processors with a convenience fee (typically 2.49% for credit cards).</li>
                <li><strong>Mail:</strong> Send Form PA-40 ES voucher with a check or money order payable to &quot;PA Department of Revenue&quot; to the address on the form.</li>
                <li><strong>Electronic Funds Transfer (EFT):</strong> Available for business taxpayers making corporate estimated payments.</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Who Must Pay PA Estimated Taxes?</p>
              <p className="mt-2">
                You must make estimated payments if you are a Pennsylvania resident, part-year resident, or nonresident with PA-source income, and you expect to owe more than $8,000 in tax after credits and withholding. This commonly applies to self-employed individuals, freelancers, sole proprietors, partners receiving Schedule K-1 income, shareholders of S-corporations, landlords with rental income, and retirees with significant non-wage income.
              </p>
            </div>
          </div>
        </section>
      )}

      {stateSlug === "new-jersey" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            New Jersey Estimated Tax Payments: Complete Guide
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-slate-600">
            <p>
              New Jersey has a progressive income tax system with rates ranging from 1.4% to 10.75% for income over $1 million. If you expect to owe $400 or more in NJ income tax after subtracting withholding and credits, you are required to make quarterly estimated payments using Form NJ-1040-ES. This threshold is significantly lower than many other states, meaning more New Jersey taxpayers must file estimated payments.
            </p>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Penalty for Underpayment</p>
              <p className="mt-2">
                New Jersey imposes an underpayment interest charge on taxpayers who fail to make sufficient estimated payments. The interest rate is set quarterly by the Division of Taxation and is typically tied to the prime rate. The penalty applies to each quarter individually, meaning even one missed payment can trigger a charge. The penalty is calculated from the due date of the missed payment until the date the tax is actually paid or the filing deadline, whichever is earlier.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Safe Harbor Rules</p>
              <p className="mt-2">
                To avoid the underpayment interest in New Jersey, you must pay at least 80% of your current year&apos;s tax liability through estimated payments and withholding, or 100% of the prior year&apos;s tax liability (110% if your NJ gross income exceeds $150,000, or $75,000 for married filing separately). New Jersey&apos;s 80% current-year safe harbor is more generous than the typical 90% federal threshold, but the lower $400 payment trigger means more taxpayers are subject to estimated payment requirements.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Payment Methods</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li><strong>NJ Online Payment Portal:</strong> Make payments electronically through the NJ Division of Taxation website at nj.gov/treasury/taxation using your bank account (free).</li>
                <li><strong>Credit/Debit Card:</strong> Available through Official Payments (ACI Payments) with a convenience fee.</li>
                <li><strong>Mail:</strong> Send Form NJ-1040-ES voucher with a check or money order payable to &quot;State of New Jersey - TGI&quot; to the address on the form.</li>
                <li><strong>NJ Fast File:</strong> Phone-based payment system for making estimated tax payments by phone.</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Special Considerations for NJ Taxpayers</p>
              <p className="mt-2">
                New Jersey does not allow a deduction for federal taxes paid. The state also taxes all retirement income (pensions, 401(k), IRA distributions) above an exclusion amount, which means retirees often need to make estimated payments. Additionally, New Jersey has a separate Corporation Business Tax (CBT) with its own estimated payment requirements for C-corporations, due on the 15th day of the 4th, 6th, 9th, and 12th months of the tax year.
              </p>
            </div>
          </div>
        </section>
      )}

      {stateSlug === "nebraska" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Nebraska Estimated Tax Payments: Complete Guide
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-slate-600">
            <p>
              Nebraska uses a progressive income tax system with rates ranging from 2.46% to 5.84% for tax year 2026. Thanks to recent tax reform (LB 873), Nebraska has been gradually reducing its top income tax rate, which previously stood at 6.84%. If you expect to owe $500 or more in Nebraska income tax after subtracting withholding and credits, you must make quarterly estimated payments using Form 1040N-ES.
            </p>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Penalty for Underpayment</p>
              <p className="mt-2">
                Nebraska charges an underpayment penalty if you do not pay enough estimated tax by each quarterly deadline. The penalty is computed on Form 2210N and is based on the applicable interest rate set by the Nebraska Department of Revenue. The rate is adjusted annually. The penalty applies separately to each quarter, meaning a late Q1 payment will incur interest even if Q2 through Q4 are paid on time. The penalty runs from the due date of the missed installment until the earlier of the payment date or April 15.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Safe Harbor Rules</p>
              <p className="mt-2">
                Nebraska follows safe harbor rules similar to the federal system. You can avoid the underpayment penalty by paying at least 90% of your current year&apos;s Nebraska tax liability, or 100% of the prior year&apos;s Nebraska tax liability through estimated payments and withholding. Nebraska does not currently impose a separate 110% threshold for higher-income taxpayers. Farmers and ranchers who earn at least two-thirds of their gross income from farming may file and pay by March 1 instead of making quarterly payments.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Payment Methods</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li><strong>NebFile Online:</strong> Nebraska&apos;s free electronic filing and payment system at revenue.nebraska.gov. Payments can be made via bank account (ACH debit) at no charge.</li>
                <li><strong>EFT (Electronic Funds Transfer):</strong> Available for individual and business estimated payments through the NebFile system.</li>
                <li><strong>Credit/Debit Card:</strong> Accepted through a third-party processor with a convenience fee (approximately 2.35% for credit cards).</li>
                <li><strong>Mail:</strong> Send Form 1040N-ES voucher with a check or money order payable to the &quot;Nebraska Department of Revenue&quot; to the address listed on the form.</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Nebraska Tax Reform Impact on Estimated Payments</p>
              <p className="mt-2">
                Nebraska&apos;s ongoing tax reform means taxpayers should recalculate their estimated payments each year rather than relying on prior-year amounts. The top individual rate is scheduled to continue declining, and the corporate tax rate has also been reduced. Additionally, Nebraska has expanded its Social Security income tax exemption, which may reduce estimated payment obligations for retirees. Check with the Nebraska Department of Revenue for the latest rate schedules before calculating your 2026 estimated payments.
              </p>
            </div>
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

      {/* Back to State link */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900">Back to {state.name} Tax Deadlines</p>
            <p className="mt-1 text-sm text-slate-600">
              View all filing deadlines, extensions, and entity-specific information for {state.name}.
            </p>
          </div>
          <Link
            href={`/state/${state.slug}`}
            className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            View All Deadlines
          </Link>
        </div>
      </section>

      {/* Neighboring States Estimated Payments */}
      {(() => {
        const neighbors = getNeighboringStates(stateSlug);
        if (neighbors.length === 0) return null;
        return (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Nearby States Estimated Payments
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Compare estimated payment schedules with neighboring states.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {neighbors.map((neighbor) => (
                <Link
                  key={neighbor.slug}
                  href={`/state/${neighbor.slug}/estimated-payments`}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
                >
                  {neighbor.name}
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Additional Navigation */}
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
