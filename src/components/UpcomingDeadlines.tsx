import { federalDeadlines } from "../lib/data";
import { formatDate, daysUntil } from "../lib/dates";

const normalize = () => {
  const items: { title: string; date: string }[] = [];
  for (const entry of federalDeadlines.entityDeadlines) {
    if (entry.dueDate) {
      items.push({
        title: `${entry.form} due`,
        date: entry.dueDate,
      });
    }
    if (entry.extensionDate) {
      items.push({
        title: `${entry.form} extension deadline`,
        date: entry.extensionDate,
      });
    }
  }
  for (const payroll of federalDeadlines.payrollDeadlines) {
    for (const date of payroll.dueDates) {
      items.push({
        title: `${payroll.form} due`,
        date,
      });
    }
  }
  return items;
};

export default function UpcomingDeadlines() {
  const now = new Date();
  const items = normalize()
    .filter((item) => new Date(item.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  return (
    <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-blue-900 p-6 text-white shadow-lg">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Upcoming Federal Deadlines</h2>
        <p className="text-sm text-blue-100">
          Key IRS due dates for the 2026 filing season.
        </p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={`${item.title}-${item.date}`} className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm font-semibold text-white">{item.title}</p>
            <p className="mt-1 text-sm text-blue-100">{formatDate(item.date)}</p>
            <p className="mt-1 text-xs text-blue-200">
              {daysUntil(item.date)} days
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
