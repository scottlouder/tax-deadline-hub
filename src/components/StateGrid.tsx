"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { State } from "../lib/data";

export default function StateGrid({ states }: { states: State[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return states;
    return states.filter((state) =>
      state.name.toLowerCase().includes(normalized) ||
      state.abbreviation.toLowerCase().includes(normalized)
    );
  }, [query, states]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Browse by State</h2>
        <p className="text-sm text-slate-600">
          Find deadlines, forms, and extensions for each state tax agency.
        </p>
        <SearchBar value={query} onChange={setQuery} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((state) => (
          <Link
            key={state.slug}
            href={`/state/${state.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">{state.name}</p>
                <p className="text-sm text-slate-500">{state.abbreviation}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {state.hasIncomeTax ? "Income tax" : "No income tax"}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              {state.taxAgency.name}
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-blue-700 group-hover:text-blue-900">
              View deadlines →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
