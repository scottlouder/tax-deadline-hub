import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    template: "%s | TaxDeadlineHub",
    default: "2026 US Tax Deadlines by State & Entity Type | TaxDeadlineHub",
  },
  description:
    "Find every 2026 federal and state tax deadline, extension date, and estimated payment schedule. Covers all 50 states and entity types including sole proprietorships, S-corps, C-corps, partnerships, and nonprofits.",
  metadataBase: new URL("https://taxdeadlinehub.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📅</text></svg>",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "TaxDeadlineHub",
    locale: "en_US",
    url: "https://taxdeadlinehub.com",
    title: "2026 US Tax Deadlines by State & Entity Type | TaxDeadlineHub",
    description:
      "Find every 2026 federal and state tax deadline, extension date, and estimated payment schedule for all 50 states.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TaxDeadlineHub - 2026 US Tax Deadlines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 US Tax Deadlines by State & Entity Type | TaxDeadlineHub",
    description:
      "Find every 2026 federal and state tax deadline, extension date, and estimated payment schedule for all 50 states.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "KOONvFZwDwDgfNwpZxGWwzcJ4r8S_CfEk2gM-h5-vNY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TaxDeadlineHub",
    url: "https://taxdeadlinehub.com",
    description:
      "Find every 2026 federal and state tax deadline, extension date, and estimated payment schedule.",
  };

  return (
    <html lang="en" className={inter.className}>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%)]">
          <Header />
          <main className="mx-auto w-full max-w-6xl px-6 py-12">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
