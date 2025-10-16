import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, MessageCircle, Phone } from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How often should I visit the dentist?",
      answer:
        "We recommend visiting the dentist every 6 months for routine cleanings and checkups. However, some patients may need more frequent visits based on their oral health condition.",
      category: "general",
    },
    {
      id: 2,
      question: "What should I expect during my first visit?",
      answer:
        "Your first visit will include a comprehensive oral examination, medical history review, digital X-rays if needed, professional cleaning, and a discussion of any treatment recommendations.",
      category: "general",
    },
    {
      id: 3,
      question: "Do you accept insurance?",
      answer:
        "Yes, we accept most major dental insurance plans. Our team will help verify your benefits and maximize your insurance coverage. We also offer flexible payment options.",
      category: "billing",
    },
    {
      id: 4,
      question: "What are your payment options?",
      answer:
        "We accept cash, credit cards, checks, and offer financing options through CareCredit. We also provide payment plans to make dental care more affordable.",
      category: "billing",
    },
    {
      id: 5,
      question: "Is teeth whitening safe?",
      answer:
        "Yes, professional teeth whitening performed by our dental team is safe and effective. We use proven whitening systems that protect your enamel while delivering excellent results.",
      category: "cosmetic",
    },
    {
      id: 6,
      question: "How long do dental implants last?",
      answer:
        "With proper care and maintenance, dental implants can last 20-30 years or even a lifetime. They have a 95% success rate and are considered the gold standard for tooth replacement.",
      category: "implants",
    },
    {
      id: 7,
      question: "What should I do in a dental emergency?",
      answer:
        "Call our emergency line immediately at 09952205380. For severe pain, trauma, or bleeding, seek immediate care. We provide 24/7 emergency services for urgent situations.",
      category: "emergency",
    },
    {
      id: 8,
      question: "How do I prepare for oral surgery?",
      answer:
        "Follow pre-operative instructions provided by our team, arrange transportation, avoid eating before surgery as directed, and take prescribed medications as instructed.",
      category: "surgery",
    },
    {
      id: 9,
      question: "Can I eat normally after a filling?",
      answer:
        "You can eat immediately after composite (white) fillings. For amalgam (silver) fillings, wait 24 hours before eating hard foods. Avoid very hot or cold foods initially.",
      category: "general",
    },
    {
      id: 10,
      question: "How much does Invisalign cost?",
      answer:
        "Invisalign treatment typically ranges from $3,000-$8,000 depending on complexity. We offer free consultations to provide exact pricing and discuss payment options.",
      category: "orthodontics",
    },
  ];

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "general", name: "General Care" },
    { id: "billing", name: "Insurance & Billing" },
    { id: "cosmetic", name: "Cosmetic Dentistry" },
    { id: "implants", name: "Dental Implants" },
    { id: "orthodontics", name: "Orthodontics" },
    { id: "emergency", name: "Emergency Care" },
    { id: "surgery", name: "Oral Surgery" },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number): void => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-50 to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our dental services,
              procedures, and policies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No questions found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or browse different categories.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded-lg"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                        openFAQ === faq.id ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openFAQ === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our friendly team is here to help. Contact us for personalized
              answers to your dental questions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Call Us
                </h3>
                <p className="text-gray-600 mb-4">
                  Speak with our team directly
                </p>
                <a
                  href="tel:09952205380"
                  className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  09952205380
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Live Chat
                </h3>
                <p className="text-gray-600 mb-4">Get instant answers 24/7</p>
                <button className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                  Start Chat
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
