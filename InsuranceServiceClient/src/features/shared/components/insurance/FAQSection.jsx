import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FAQSection({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
          >
            <span className="font-medium text-gray-900">{faq.question}</span>
            {openIndex === index ? (
              <ChevronUp className="size-5 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronDown className="size-5 text-gray-500 flex-shrink-0" />
            )}
          </button>
          {openIndex === index && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-gray-700 whitespace-pre-line">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

