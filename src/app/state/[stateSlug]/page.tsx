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
  getNeighboringStates,
  getPopularStates,
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

  const neighboringStates = getNeighboringStates(slug);
  const popularStatesList = getPopularStates();

  const noIncomeTaxDetails: Record<string, { taxes: string; businessTax: string }> = {
    alaska: {
      taxes: "Alaska has no state income tax or sales tax. However, residents pay property taxes, and local municipalities may levy their own sales taxes. Alaska also imposes a corporate income tax on businesses.",
      businessTax: "Yes. Alaska levies a corporate income tax ranging from 0% to 9.4% on net income. Oil and gas companies face additional production taxes and surcharges.",
    },
    florida: {
      taxes: "Florida has no state income tax. Residents pay a 6% state sales tax (plus local surtaxes up to 2%), property taxes, and documentary stamp taxes on real estate transactions.",
      businessTax: "Yes. Florida imposes a 5.5% corporate income tax on C-corporations with taxable income exceeding $50,000. S-corps and sole proprietors are generally exempt.",
    },
    nevada: {
      taxes: "Nevada has no state income or corporate income tax. Revenue comes primarily from sales tax (6.85% base rate plus local additions), gaming taxes, and property taxes.",
      businessTax: "Yes. Nevada imposes a Commerce Tax on businesses with gross revenue exceeding $4 million and a Modified Business Tax on employer-paid wages.",
    },
    "new-hampshire": {
      taxes: "New Hampshire has no general income tax or sales tax. However, the state levies property taxes (among the highest in the nation) and an Interest & Dividends Tax that is being phased out.",
      businessTax: "Yes. New Hampshire imposes a Business Profits Tax (7.5%) and a Business Enterprise Tax (0.55%) on businesses operating in the state.",
    },
    "south-dakota": {
      taxes: "South Dakota has no state income tax, corporate income tax, or personal property tax. The state relies on a 4.5% sales tax (plus local additions) and property taxes for revenue.",
      businessTax: "South Dakota has no corporate income tax. Businesses pay sales tax on taxable goods, bank franchise taxes for financial institutions, and various excise taxes.",
    },
    tennessee: {
      taxes: "Tennessee has no state income tax on wages or salary (the Hall Income Tax on investment income was fully repealed in 2021). The state has a 7% sales tax (plus local additions up to 2.75%) and property taxes.",
      businessTax: "Yes. Tennessee imposes a franchise tax (0.25% of net worth or book value of real/tangible personal property) and an excise tax (6.5% of net earnings) on businesses.",
    },
    texas: {
      taxes: "Texas has no state income tax. Revenue comes from a 6.25% state sales tax (plus local additions up to 2%), property taxes (among the highest in the nation), and various excise taxes.",
      businessTax: "Yes. Texas imposes a Franchise Tax (also called the margin tax) on businesses with revenue exceeding $2.47 million, at rates of 0.375% to 0.75% depending on the type of business.",
    },
    washington: {
      taxes: "Washington has no state income tax. The state relies on a 6.5% sales tax (plus local additions), property taxes, and a Business & Occupation (B&O) tax. A 7% capital gains tax applies to gains over $250,000.",
      businessTax: "Yes. Washington's B&O tax applies to gross receipts at rates ranging from 0.138% to 3.3% depending on business classification. There is no deduction for costs of doing business.",
    },
    wyoming: {
      taxes: "Wyoming has no state income tax, corporate income tax, or estate tax. The state has a 4% sales tax (plus local additions up to 2%) and property taxes.",
      businessTax: "Wyoming has no corporate income tax. Businesses pay sales tax on taxable goods, and mineral extraction companies pay severance taxes. There is no general business tax on revenue or profits.",
    },
  };

  const stateNoTaxInfo = !state.hasIncomeTax ? noIncomeTaxDetails[state.slug] : null;

  const faqItems = [
    {
      question: `When are taxes due in ${state.name}?`,
      answer: state.hasIncomeTax
        ? `${state.name} state income tax returns for 2025 are generally due on April 15, 2026, aligning with the federal deadline. However, some entity types such as partnerships and S-corporations have earlier deadlines (March 16, 2026). Check the deadlines above for your specific entity type.`
        : `${state.name} does not have a state income tax, so there is no state income tax filing deadline. However, residents must still file their federal income tax return by April 15, 2026.`,
    },
    {
      question: `Does ${state.name} require estimated tax payments?`,
      answer: state.hasIncomeTax
        ? `Yes, ${state.name} generally requires estimated tax payments if you expect to owe more than a certain threshold in state income tax. Payments typically follow a quarterly schedule. Visit the estimated payments page for ${state.name} for specific due dates.`
        : `${state.name} does not levy a state income tax, so state-level estimated tax payments are not required. However, you may still need to make federal estimated tax payments.`,
    },
    {
      question: `What is the ${state.name} tax extension deadline?`,
      answer: state.hasIncomeTax
        ? `${state.name} generally grants a 6-month extension for filing state income tax returns, moving the deadline to October 15, 2026 for most individual filers. Note that an extension to file is not an extension to pay — any tax owed is still due by the original deadline.`
        : `Since ${state.name} does not have a state income tax, there is no state extension deadline. For federal taxes, you can request an automatic 6-month extension to October 15, 2026 using Form 4868.`,
    },
    {
      question: `What are the ${state.name} tax rates for 2026?`,
      answer: state.hasIncomeTax
        ? `${state.name} tax rates vary by income level and filing status. For the most current rates and brackets, visit ${state.taxAgency.name} at ${state.taxAgency.url}. Tax rates can change annually based on state legislation.`
        : `${state.name} does not impose a state income tax on individuals. However, other taxes such as sales tax, property tax, and business taxes may apply. Visit ${state.taxAgency.name} for details.`,
    },
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
    ...(stateNoTaxInfo
      ? [
          {
            question: `Does ${state.name} have any business taxes?`,
            answer: stateNoTaxInfo.businessTax,
          },
          {
            question: `What taxes do ${state.name} residents still need to pay?`,
            answer: stateNoTaxInfo.taxes,
          },
          {
            question: `Are there any state-level tax obligations in ${state.name}?`,
            answer: `While ${state.name} does not have a state income tax, residents and businesses are still subject to federal income tax obligations. Additionally, ${stateNoTaxInfo.taxes.toLowerCase().includes("property tax") ? "property taxes, " : ""}${stateNoTaxInfo.taxes.toLowerCase().includes("sales tax") ? "sales taxes, " : ""}and other state-specific taxes may apply. Visit ${state.taxAgency.name} for complete details.`,
          },
        ]
      : []),
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

      {/* State-specific expanded content for top-performing pages */}
      {slug === "missouri" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Missouri Tax Deadlines 2026: Detailed Guide
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-slate-600">
            <p>
              Missouri imposes a progressive income tax with rates ranging from 2.0% to 4.8% for tax year 2026. The state has been gradually reducing its top rate from the previous 5.3% as part of ongoing tax reform legislation. Missouri conforms closely to federal tax deadlines, making it convenient for taxpayers who file both returns simultaneously.
            </p>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Individual Filing Deadline</p>
              <p className="mt-2">
                Missouri individual income tax returns (Form MO-1040) are due April 15, 2026, matching the federal deadline. If you cannot file by this date, Missouri grants an automatic 6-month extension to October 15, 2026. However, you must pay at least 90% of your tax liability by the original April 15 deadline to avoid penalties and interest. File an extension request using Form MO-60.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Business Entity Deadlines</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li><strong>Partnerships (Form MO-1065):</strong> Due March 16, 2026, with a 6-month extension to September 15, 2026. Missouri partnerships must file an informational return and issue K-1s to partners.</li>
                <li><strong>S Corporations (Form MO-1120S):</strong> Due March 16, 2026, with extension to September 15, 2026. S-corps pass income through to shareholders but must still file a Missouri return.</li>
                <li><strong>C Corporations (Form MO-1120):</strong> Due April 15, 2026, for calendar-year filers, with extension to October 15, 2026. Missouri corporate income tax is 4% of Missouri taxable income.</li>
                <li><strong>Nonprofits:</strong> Due May 15, 2026, with extension to November 15, 2026. Tax-exempt organizations must file if they have Missouri unrelated business income.</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Estimated Tax Payments in Missouri</p>
              <p className="mt-2">
                Missouri requires quarterly estimated tax payments if you expect to owe $100 or more in state income tax after subtracting withholding and credits. Use Form MO-1040ES to submit payments. The quarterly due dates are April 15, June 15, and September 15 of 2026, and January 15, 2027. Underpayment penalties may apply if you fail to pay at least 90% of the current year&apos;s liability or 100% of the prior year&apos;s liability.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Missouri Tax Credits and Deductions</p>
              <p className="mt-2">
                Missouri offers several tax credits that can reduce your overall liability and affect estimated payment calculations. These include the Property Tax Credit (Circuit Breaker) for eligible seniors and disabled individuals, the Missouri Earned Income Tax Credit (equal to 10% of the federal EITC), and credits for contributions to Missouri 529 education savings plans (MOST). Missouri also allows a deduction for 100% of federal income taxes paid, which is relatively unique among states.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Payment Methods</p>
              <p className="mt-2">
                Missouri accepts tax payments through several channels: the Missouri Department of Revenue online portal at dor.mo.gov (free for bank account payments), credit or debit card payments through approved processors (convenience fees apply), and mail with paper vouchers and check or money order payable to the &quot;Director of Revenue.&quot; Missouri also supports electronic funds transfer for business taxpayers.
              </p>
            </div>
          </div>
        </section>
      )}

      {stateNoTaxInfo && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Taxes in {state.name}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Although {state.name} is one of nine U.S. states with no state income
            tax, residents and businesses are still responsible for other tax
            obligations at the federal, state, and local levels.
          </p>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              What taxes apply in {state.name}?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {stateNoTaxInfo.taxes}
            </p>
          </div>
          <div className="mt-3 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Business tax obligations
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {stateNoTaxInfo.businessTax}
            </p>
          </div>
        </section>
      )}

      <FAQSection faqs={faqItems} />

      {/* Related Pages - Entity-specific pages for this state */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          {state.name} Tax Deadlines by Entity Type
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          View detailed deadlines for specific business entity types in {state.name}.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {entityTypes.map((entity) => (
            <Link
              key={entity.slug}
              href={`/state/${state.slug}/${entity.slug}`}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="font-semibold text-blue-800">{entity.name}</p>
              <p className="mt-1 text-xs text-slate-500">{entity.deadlineInfo}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Nearby States */}
      {neighboringStates.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Nearby State Tax Deadlines
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Compare tax deadlines with neighboring states.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {neighboringStates.map((neighbor) => (
              <Link
                key={neighbor.slug}
                href={`/state/${neighbor.slug}`}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
              >
                {neighbor.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Popular States Quick Links */}
      <section className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Popular States</h2>
        <p className="mt-1 text-sm text-slate-600">
          Quick links to the most-searched state tax deadline pages.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {popularStatesList
            .filter((s) => s.slug !== state.slug)
            .map((s) => (
              <Link
                key={s.slug}
                href={`/state/${s.slug}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:text-blue-700"
              >
                {s.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
