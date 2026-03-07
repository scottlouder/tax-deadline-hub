import { Metadata } from "next";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import DeadlineCard from "../../../../components/DeadlineCard";
import FAQSection from "../../../../components/FAQSection";
import {
  entityTypes,
  getEntityBySlug,
  getStateBySlug,
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
    ? `${entity.name} Tax Deadlines in ${state.name} | TaxDeadlineHub`
    : "State Entity Tax Deadlines | TaxDeadlineHub";
  const description = state && entity
    ? `${entity.name} filing dates, extensions, and estimates for ${state.name} in 2026.`
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

  const faqItems = [
    {
      question: `Does ${state.name} require ${entity.name} estimated payments?`,
      answer: deadline.estimatedPayments.length
        ? `Estimated payments are scheduled for ${deadline.estimatedPayments
            .map((date) => formatDate(date))
            .join(", ")}.`
        : `Estimated payments are not typically required at the entity level, but confirm with ${state.taxAgency.name}.`,
    },
    {
      question: `Where can I file ${state.name} ${entity.name} taxes?`,
      answer: `Use ${state.taxAgency.name} resources at ${state.taxAgency.url} for forms and filing instructions.`,
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
          {entity.name} Tax Deadlines in {state.name}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Federal and state filing dates, extensions, and estimate schedules for 2026.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <DeadlineCard
          title={`${state.name} filing deadline`}
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
              ? `Estimated payment dates: ${deadline.estimatedPayments
                  .map((date) => formatDate(date))
                  .join(", ")}.`
              : "No state estimated payment schedule listed."
          }
        />
      </section>

      <FAQSection faqs={faqItems} />
    </div>
  );
}
