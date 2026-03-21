import taxChangesData from "../data/tax-changes-2026.json";

export type TaxChangeFaq = {
  question: string;
  answer: string;
};

export type TaxChangeDeadline = {
  date: string;
  description: string;
};

export type TaxChange = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  effectiveDate: string;
  claimMethod: string;
  eligibility: string;
  keyFacts: string[];
  relatedDeadlines: TaxChangeDeadline[];
  faqs: TaxChangeFaq[];
  targetKeywords: string[];
};

const taxChanges = taxChangesData as TaxChange[];

export const getAllTaxChanges = (): TaxChange[] => taxChanges;

export const getTaxChangeBySlug = (slug: string): TaxChange | null =>
  taxChanges.find((change) => change.slug === slug) ?? null;

export const getAllTaxChangeSlugs = (): string[] =>
  taxChanges.map((change) => change.slug);
