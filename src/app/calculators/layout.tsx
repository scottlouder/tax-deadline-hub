import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tax Calculators & Tools",
  description:
    "Free tax calculators for 2026: estimate your federal and state tax liability, quarterly estimated payments, and extension deadlines.",
  alternates: { canonical: "/calculators" },
  openGraph: {
    title: "Tax Calculators & Tools | TaxDeadlineHub",
    description:
      "Free tax calculators for 2026: estimate your federal and state tax liability, quarterly estimated payments, and extension deadlines.",
    url: "/calculators",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tax Calculators & Tools | TaxDeadlineHub",
    description:
      "Free tax calculators for 2026: estimate your federal and state tax liability, quarterly estimated payments, and extension deadlines.",
  },
};

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
