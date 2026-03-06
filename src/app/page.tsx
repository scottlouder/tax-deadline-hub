import Link from "next/link";
import StateGrid from "../components/StateGrid";
import UpcomingDeadlines from "../components/UpcomingDeadlines";
import FAQSection from "../components/FAQSection";
import { entityTypes, states } from "../lib/data";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-8 text-white shadow-xl">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">TaxDeadlineHub</p>
          <h1 className="text-4xl font-semibold md:text-5xl">
            2026 US Tax Deadline Calendar for every state and entity type.
          </h1>
          <p className="text-base text-blue-100">
            Track federal and state filing dates, extensions, and quarterly estimates in one searchable hub.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#states"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-900 shadow-sm"
            >
              Explore states
            </Link>
            <Link
              href="#entities"
              className="rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white"
            >
              View entity types
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">States Covered</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">51</p>
          <p className="mt-2 text-sm text-slate-600">All 50 states plus DC.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Entity Types</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">6</p>
          <p className="mt-2 text-sm text-slate-600">Sole props, partnerships, corps, LLCs, and nonprofits.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Filing Year</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">2026</p>
          <p className="mt-2 text-sm text-slate-600">Federal and state deadlines aligned to 2026.</p>
        </div>
      </section>

      <UpcomingDeadlines />

      <section id="states">
        <StateGrid states={states} />
      </section>

      <section id="entities" className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Browse by Entity Type</h2>
          <p className="mt-2 text-sm text-slate-600">
            Federal due dates plus every state that aligns or differs.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {entityTypes.map((entity) => (
            <Link
              key={entity.slug}
              href={`/entity/${entity.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-lg font-semibold text-slate-900">{entity.name}</p>
              <p className="mt-2 text-sm text-slate-600">{entity.description}</p>
              <p className="mt-3 text-sm font-semibold text-blue-700">{entity.deadlineInfo}</p>
            </Link>
          ))}
        </div>
      </section>

      <FAQSection />
    </div>
  );
}
