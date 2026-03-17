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
    </div>
  );
}
