import { daysUntil, formatDate, urgencyClass } from "../lib/dates";

type QuarterDate = { label: string; date: string };

export default function EstimatedPaymentCalendar({
  dates,
  title,
}: {
  dates: string[];
  title?: string;
}) {
  const quarters: QuarterDate[] = dates.map((date, i) => ({
    label: `Q${i + 1}`,
    date,
  }));

  if (quarters.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {title ? (
        <p className="mb-4 text-base font-semibold text-slate-900">{title}</p>
      ) : null}
      <div className="relative" style={{ minHeight: `${quarters.length * 60 + 8}px` }}>
        {/* Timeline bar */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200" />

        <div className="space-y-5">
          {quarters.map((q) => {
            const days = daysUntil(q.date);
            const isPast = days !== null && days < 0;
            const isNext =
              days !== null && days >= 0 && quarters.findIndex((qx) => {
                const d = daysUntil(qx.date);
                return d !== null && d >= 0;
              }) === quarters.indexOf(q);

            return (
              <div key={q.date} className="relative flex items-start gap-4 pl-0">
                {/* Dot */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isPast
                      ? "bg-slate-100 text-slate-400"
                      : isNext
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {q.label}
                </div>
                {/* Content */}
                <div className="pt-1.5">
                  <p className={`text-sm font-semibold ${isPast ? "text-slate-400 line-through" : "text-slate-900"}`}>
                    {formatDate(q.date)}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${urgencyClass(days)}`}
                  >
                    {isPast
                      ? "Passed"
                      : days !== null && days <= 7
                        ? `${days} day${days === 1 ? "" : "s"} away`
                        : days !== null && days <= 30
                          ? `${days} days away`
                          : days !== null
                            ? `${days} days away`
                            : "N/A"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
