import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "State Tax Filing Deadlines 2026: All 50 States | TaxDeadlineHub",
  description:
    "Complete state-by-state guide to 2026 tax filing deadlines. Find your state's income tax due dates, extension deadlines, and estimated payment schedules.",
  keywords: [
    "state tax deadlines 2026",
    "state income tax due dates",
    "state tax filing deadlines",
    "when are state taxes due",
    "state tax extension deadline",
    "state estimated tax payments",
  ],
  alternates: {
    canonical: "https://taxdeadlinehub.com/blog/state-tax-filing-deadlines-2026",
  },
};

const stateGroups = {
  noIncomeTax: [
    { name: "Alaska", slug: "alaska", note: "No state income tax" },
    { name: "Florida", slug: "florida", note: "No state income tax" },
    { name: "Nevada", slug: "nevada", note: "No state income tax" },
    { name: "New Hampshire", slug: "new-hampshire", note: "Interest & dividends tax repealed 2025" },
    { name: "South Dakota", slug: "south-dakota", note: "No state income tax" },
    { name: "Tennessee", slug: "tennessee", note: "Hall Tax repealed 2021" },
    { name: "Texas", slug: "texas", note: "No state income tax" },
    { name: "Washington", slug: "washington", note: "No income tax (has capital gains tax)" },
    { name: "Wyoming", slug: "wyoming", note: "No state income tax" },
  ],
  april15: [
    "Alabama", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Georgia", "Idaho", "Illinois", "Indiana", "Kansas", "Kentucky",
    "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
    "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "Utah",
    "Vermont", "West Virginia", "Wisconsin",
  ],
  different: [
    { name: "Delaware", slug: "delaware", deadline: "April 30", note: "15 days after federal" },
    { name: "Hawaii", slug: "hawaii", deadline: "April 20", note: "5 days after federal" },
    { name: "Iowa", slug: "iowa", deadline: "April 30", note: "15 days after federal" },
    { name: "Louisiana", slug: "louisiana", deadline: "May 15", note: "30 days after federal" },
    { name: "Maine", slug: "maine", deadline: "April 15", note: "Follows federal; watch for Patriot's Day adjustment" },
    { name: "Virginia", slug: "virginia", deadline: "May 1", note: "16 days after federal" },
  ],
};

export default function StateTaxDeadlines2026() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-700">Home</Link>{" "}/{" "}
        <Link href="/blog" className="hover:text-blue-700">Blog</Link>{" "}/{" "}
        State Tax Filing Deadlines 2026
      </nav>

      <article>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          State Tax Filing Deadlines for 2026: Complete Guide
        </h1>
        <p className="text-gray-500 mb-8">
          Last updated: March 18, 2026 | Reading time: 7 min
        </p>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8">
            While most states follow the federal April 15 deadline, several states have
            their own unique filing dates. This guide breaks down every state&apos;s tax
            deadline so you never file late.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            States With No Income Tax (9 States)
          </h2>
          <p className="text-gray-700 mb-4">
            These states don&apos;t levy a personal income tax, so there&apos;s no state
            return to file:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            {stateGroups.noIncomeTax.map((state) => (
              <Link
                key={state.slug}
                href={`/state/${state.slug}`}
                className="block p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition"
              >
                <div className="font-semibold text-green-900">{state.name}</div>
                <div className="text-sm text-green-700 mt-1">{state.note}</div>
              </Link>
            ))}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
            <h3 className="font-bold text-blue-900 mb-2">Important Note</h3>
            <p className="text-blue-800">
              Even in no-income-tax states, businesses may owe franchise taxes, gross receipts
              taxes, or other state-level taxes with their own deadlines. Check your state&apos;s
              page for details.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            States Following the April 15 Federal Deadline (35 States)
          </h2>
          <p className="text-gray-700 mb-4">
            The majority of states with an income tax use the same April 15 deadline as the
            federal government:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
            {stateGroups.april15.map((state) => (
              <Link
                key={state}
                href={`/state/${state.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-blue-700 hover:underline text-sm p-2 bg-gray-50 rounded hover:bg-blue-50 transition"
              >
                {state}
              </Link>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            States With Different Deadlines (6 States)
          </h2>
          <p className="text-gray-700 mb-4">
            These states have their own filing deadlines that differ from the federal date:
          </p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left">State</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">2026 Deadline</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Note</th>
                </tr>
              </thead>
              <tbody>
                {stateGroups.different.map((state, i) => (
                  <tr key={state.slug} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                    <td className="border border-gray-300 px-4 py-3">
                      <Link href={`/state/${state.slug}`} className="text-blue-700 hover:underline font-semibold">
                        {state.name}
                      </Link>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 font-bold text-blue-700">
                      {state.deadline}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-600">
                      {state.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            State Extension Deadlines
          </h2>
          <p className="text-gray-700 mb-4">
            Most states grant an automatic extension if you&apos;ve filed a federal extension
            (Form 4868). However, the rules vary:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-6">
            <li>
              <strong>Automatic with federal extension:</strong> California, New York,
              Illinois, and most other states accept the federal extension automatically —
              no separate state form needed
            </li>
            <li>
              <strong>Separate state extension required:</strong> Georgia, Connecticut,
              and a few others require you to file a separate state extension form
            </li>
            <li>
              <strong>Extension length varies:</strong> Most states grant 6 months (matching
              federal), but some give 5 or 7 months
            </li>
            <li>
              <strong>Payment is still due:</strong> Like the federal extension, state
              extensions only extend the filing deadline — estimated tax owed must be paid
              by the original due date
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            State Estimated Tax Payment Schedules
          </h2>
          <p className="text-gray-700 mb-4">
            Most states follow the federal quarterly schedule (April 15, June 15,
            September 15, January 15). Notable exceptions:
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8 rounded-r-lg">
            <h3 className="font-bold text-yellow-900 mb-2">California&apos;s Unusual Schedule</h3>
            <p className="text-yellow-800">
              California does NOT split estimated payments equally. The schedule is:
              <strong> 30% (Q1)</strong>, <strong>40% (Q2)</strong>,{" "}
              <strong>0% (Q3)</strong>, <strong>30% (Q4)</strong>. Yes, Q3 is zero.
              This trips up many taxpayers new to California.
            </p>
          </div>

          <p className="text-gray-700 mb-6">
            For detailed state-by-state estimated payment requirements, visit our{" "}
            <Link href="/estimated-payments" className="text-blue-700 hover:underline">
              estimated payments overview
            </Link>{" "}
            or select your state below.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Business Tax Deadlines by State
          </h2>
          <p className="text-gray-700 mb-4">
            Business entity deadlines at the state level generally mirror federal rules:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-6">
            <li>
              <strong>S-Corps and Partnerships:</strong> March 15 in most states (matching federal)
            </li>
            <li>
              <strong>C-Corps:</strong> April 15 or the 15th of the 4th month after fiscal year-end
            </li>
            <li>
              <strong>Nonprofits:</strong> May 15 (Form 990 equivalent at state level)
            </li>
            <li>
              <strong>Annual reports and franchise taxes:</strong> These vary widely — some
              states require annual reports on the anniversary of incorporation, others have
              fixed dates
            </li>
          </ul>

          <p className="text-gray-700 mb-4">
            For entity-specific deadlines in your state, visit:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8">
            {["sole-proprietorship", "partnership", "s-corp", "c-corp", "llc", "nonprofit"].map((entity) => (
              <Link
                key={entity}
                href={`/entity/${entity}`}
                className="text-blue-700 hover:underline text-sm p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition capitalize"
              >
                {entity.replace("-", " ")} Deadlines →
              </Link>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Find Your State
          </h2>
          <p className="text-gray-700 mb-4">
            Click your state for complete filing deadlines, estimated payment dates,
            extension rules, and entity-specific information:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
            {[
              "Alabama", "Alaska", "Arizona", "Arkansas", "California",
              "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
              "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas",
              "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
              "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
              "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
              "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
              "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
              "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
              "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
              "District of Columbia",
            ].map((state) => (
              <Link
                key={state}
                href={`/state/${state.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-blue-700 hover:underline text-xs p-2 bg-gray-50 rounded hover:bg-blue-50 transition text-center"
              >
                {state}
              </Link>
            ))}
          </div>
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Related Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/blog/2026-federal-tax-deadlines" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
            <div className="font-semibold text-blue-900">2026 Federal Tax Deadlines</div>
            <div className="text-sm text-blue-700 mt-1">Complete federal filing calendar</div>
          </Link>
          <Link href="/blog/estimated-tax-payments-guide" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
            <div className="font-semibold text-blue-900">Estimated Tax Payments Guide</div>
            <div className="text-sm text-blue-700 mt-1">How to calculate and pay quarterly estimated taxes</div>
          </Link>
        </div>
      </div>
    </main>
  );
}
