"use client";

import { useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";

interface BulkInquiryProps {
  productTitle?: string;
  sku?: string;
  className?: string;
}

export default function BulkInquiryForm({ productTitle, sku, className = "" }: BulkInquiryProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    quantity: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.quantity) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto my-12 ${className}`}>
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-sm text-center">
        {/* Heading */}
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1a1e29] font-display tracking-tight">
          Looking to order Bulk Quantity?
        </h3>

        {/* Subtitle */}
        <p className="mt-2 text-sm sm:text-base text-neutral-500 italic max-w-2xl mx-auto">
          Request a quote below and one of our sales representatives will reach out to you shortly.
        </p>

        {submitted ? (
          <div className="mt-8 py-8 px-6 rounded-2xl bg-blue-50/60 border border-blue-200 text-center max-w-xl mx-auto">
            <CheckCircle2 size={44} className="mx-auto text-[#0066ff] mb-3" />
            <h4 className="text-xl font-bold text-navy">Bulk Quote Request Submitted!</h4>
            <p className="mt-2 text-sm text-neutral-600">
              Thank you, <strong className="text-navy">{formData.fullName}</strong>. We received your quote request for{" "}
              <strong>{formData.quantity} units</strong> {productTitle ? `of "${productTitle}"` : ""} {sku ? `(SKU: ${sku})` : ""}.
            </p>
            <p className="mt-2 text-xs text-neutral-500 flex items-center justify-center gap-1.5">
              <Clock size={14} className="text-[#0066ff]" />
              <span>Quotes are processed Monday through Friday, 6:00 AM – 6:00 PM (PST) with average response time of 5–10 minutes.</span>
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ fullName: "", email: "", phoneNumber: "", quantity: "" });
              }}
              className="mt-6 text-xs font-bold text-[#0066ff] hover:underline"
            >
              Submit another bulk inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-3xl mx-auto space-y-3.5">
            {/* Row 1: Full Name | Email | Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] transition-all bg-white"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] transition-all bg-white"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] transition-all bg-white"
                />
              </div>
            </div>

            {/* Row 2: Quantity (Full Width) */}
            <div>
              <input
                type="text"
                required
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] transition-all bg-white text-center sm:text-left"
              />
            </div>

            {/* Row 3: Submit Button (Full Width, Pink as requested in screenshot) */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-lg bg-[#FCE0F0] hover:bg-[#F9CFE6] active:bg-[#F5BEDA] text-neutral-900 font-bold text-sm tracking-wide transition-colors border border-pink-200/80 shadow-xs flex items-center justify-center cursor-pointer"
              >
                {isSubmitting ? "Submitting Request..." : "Submit"}
              </button>
            </div>
          </form>
        )}

        {/* Footer Disclaimer Text */}
        <div className="mt-6 text-xs text-neutral-500 leading-relaxed max-w-2xl mx-auto space-y-1">
          <p className="font-semibold text-neutral-600">
            Quotes are processed Monday through Friday, 6:00 AM – 6:00 PM (PST), with an average response time of 5–10 minutes.
          </p>
          <p className="italic text-neutral-400">
            Submissions made on holidays will be addressed on the next business day.
          </p>
        </div>
      </div>
    </div>
  );
}
