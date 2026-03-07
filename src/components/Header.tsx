import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/estimated-payments", label: "Estimated Payments" },
  { href: "/calculators", label: "Calculators" },
];

export default function Header() {
  return (
    <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <span className="rounded-lg bg-slate-900 px-2 py-1 text-sm font-semibold text-white">TDH</span>
          <span className="font-display">TaxDeadlineHub</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-slate-900">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
