import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

const faqs = [
  {
    question: "What information will be in my report?",
    answer: "Season performance analysis, transfer history, captain choices, player ownership, and detailed statistics comparing your performance to others.",
  },
  {
    question: "How often are reports updated?",
    answer: "Reports are generated with the latest data after each gameweek is completed.",
  },
  {
    question: "Can I see past seasons?",
    answer: "Currently, reports are available for the 2024/25 and 2025/26 seasons.",
  },
  {
    question: "How do I find my FPL Manager ID?",
    answer: "Log in to the Official FPL website, click on the \"Points\" tab, and look at the number in your browser's address bar after /entry/.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-full bg-white text-gray-900">
      <div className="mx-auto px-3 py-6 sm:px-6 sm:py-10 max-w-[720px]">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-mono font-medium text-gray-500 hover:text-gray-900 mb-4 no-underline">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-sans font-normal uppercase mb-6 sm:text-3xl sm:mb-8">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="border border-gray-200 p-4 sm:p-5">
              <h3 className="font-mono font-bold text-sm mb-1 sm:text-base">{faq.question}</h3>
              <p className="text-gray-500 text-sm font-body font-normal">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
