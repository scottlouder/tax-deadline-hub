import { daysUntil, formatDate, urgencyClass, urgencyLabel } from "../lib/dates";

export default function DeadlineCard({
  title,
  dueDate,
  extensionDate,
  description,
  form,
  notes,
  estimatedDates,
}: {
  title: string;
  dueDate: string | null;
  extensionDate?: string | null;
  description?: string;
  form?: string | null;
  notes?: string;
  estimatedDates?: string[];
}) {
  const quarterLabels = ["Q1", "Q2", "Q3", "Q4"];
  const days = daysUntil(dueDate ?? null);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-slate-900">{title}</p>
          {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${urgencyClass(days)}`}>
          {urgencyLabel(days)}
        </span>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p><span className="font-semibold">Due:</span> {formatDate(dueDate ?? null)}</p>
        {extensionDate ? (
          <p><span className="font-semibold">Extension:</span> {formatDate(extensionDate ?? null)}</p>
        ) : null}
        {form ? (
          <p><span className="font-semibold">Form:</span> {form}</p>
        ) : null}
        {notes ? (
          <p className="text-slate-500">{notes}</p>
        ) : null}
        {estimatedDates && estimatedDates.length > 0 ? (
          <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated Payments</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {estimatedDates.map((date, i) => {
                const days = daysUntil(date);
                return (
                  <div key={date} className="flex items-center gap-2">
                    <span className={`inline-flex h-6 w-8 items-center justify-center rounded text-xs font-bold ${urgencyClass(days)}`}>
                      {quarterLabels[i] ?? `P${i + 1}`}
                    </span>
                    <span className="text-xs text-slate-700">{formatDate(date)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
