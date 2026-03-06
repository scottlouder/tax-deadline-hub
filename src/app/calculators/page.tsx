"use client";

import { useMemo, useState } from "react";
import { entityTypes, federalDeadlines } from "../../lib/data";
import { formatDate } from "../../lib/dates";

const extensionMap: Record<string, number> = {
  "sole-proprietorship": 6,
  partnership: 6,
  "s-corporation": 6,
  "c-corporation": 6,
  llc: 6,
  nonprofit: 6,
};

const addMonths = (date: Date, months: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

export default function CalculatorsPage() {
  const [entitySlug, setEntitySlug] = useState("sole-proprietorship");
  const [baseDate, setBaseDate] = useState("2026-04-15");

  const extensionDate = useMemo(() => {
    const months = extensionMap[entitySlug] ?? 6;
    const date = new Date(baseDate + "T00:00:00");
    if (Number.isNaN(date.getTime())) return null;
    return addMonths(date, months);
  }, [entitySlug, baseDate]);

  const quarterly = useMemo(() => {
    if (entitySlug === "c-corporation" || entitySlug === "s-corporation") {
      return ["2026-04-15", "2026-06-15", "2026-09-15", "2026-12-15"];
    }
    return ["2026-04-15", "2026-06-15", "2026-09-15", "2027-01-15"];
  }, [entitySlug]);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-8 text-white shadow-xl">
        <h1 className="text-3xl font-semibold">Tax Deadline Calculators</h1>
        <p className="mt-2 text-sm text-blue-100">
          Quick calculators for extensions and quarterly estimated taxes.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Extension Deadline Calculator</h2>
          <p className="mt-2 text-sm text-slate-600">
            Estimate your extension deadline based on the original due date.
          </p>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Entity type
              <select
                value={entitySlug}
                onChange={(event) => setEntitySlug(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {entityTypes.map((entity) => (
                  <option key={entity.slug} value={entity.slug}>
                    {entity.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Original due date
              <input
                type="date"
                value={baseDate}
                onChange={(event) => setBaseDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Estimated extension deadline</p>
            <p className="mt-1">
              {extensionDate
                ? extensionDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Select a valid date"}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Quarterly Estimate Builder</h2>
          <p className="mt-2 text-sm text-slate-600">
            Plan quarterly payments for 2026 based on entity type.
          </p>
          <div className="mt-6 space-y-3">
            {quarterly.map((date) => (
              <div key={date} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{formatDate(date)}</p>
                <p className="text-xs text-slate-500">Quarterly estimate due</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            IRS estimate schedule sourced from federal deadlines list.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Federal baseline</h2>
        <p className="mt-2 text-sm text-slate-600">
          Use these dates as a baseline when estimating state due dates.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {federalDeadlines.entityDeadlines.map((entry) => (
            <div key={entry.entityType} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{entry.form}</p>
              <p className="text-xs text-slate-500">Due {formatDate(entry.dueDate)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
