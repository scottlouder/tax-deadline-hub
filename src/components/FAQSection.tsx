const defaultFaqs = [
  {
    question: "What happens if my tax deadline falls on a weekend?",
    answer: "The IRS and most states move the due date to the next business day when a deadline lands on a weekend or holiday.",
  },
  {
    question: "Does an extension give me more time to pay?",
    answer: "Extensions typically give you more time to file, not more time to pay. Any tax owed is still due by the original deadline.",
  },
  {
    question: "Are state deadlines always the same as federal?",
    answer: "Many states conform to federal due dates, but some states set different deadlines or extensions, so always verify with the state tax agency.",
  },
];

export default function FAQSection({
  faqs = defaultFaqs,
}: {
  faqs?: { question: string; answer: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">FAQ</h2>
      <div className="mt-4 space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
            <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
          </div>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
