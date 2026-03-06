import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">TaxDeadlineHub</p>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Programmatic deadlines for federal and state tax calendars, built for founders and finance teams.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <Link href="/calculators" className="hover:text-slate-900">Calculators</Link>
        </div>
      </div>
    </footer>
  );
}
