import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    type: "article",
    siteName: "TaxDeadlineHub",
    locale: "en_US",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
