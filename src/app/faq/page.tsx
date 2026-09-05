const groups = [
  {
    title: "Shipping",
    items: [
      ["Do you offer free shipping?", "Yes — qualifying US orders over $199 unlock free ground shipping in this demo. Live policy can also use a weight cap."],
      ["Do you ship internationally?", "Yes. Duties and taxes are paid by the customer unless quoted otherwise."],
    ],
  },
  {
    title: "Condition & warranty",
    items: [
      ["What is certified refurbished?", "Tested, repaired if needed, and sold with a 30-day replacement window."],
      ["How do returns work?", "Request an RMA within 30 days. Unused items may incur a restocking fee."],
    ],
  },
  {
    title: "Payments",
    items: [
      ["Which cards do you take?", "Visa, Mastercard, American Express, Discover, plus PayPal and wire for B2B."],
      ["Can we use a purchase order?", "Authorized business accounts can check out with PO / net terms."],
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="container-se max-w-3xl py-12">
      <h1 className="text-4xl font-bold text-navy">FAQs</h1>
      {groups.map((group) => (
        <section key={group.title} className="mt-8">
          <h2 className="text-xl font-semibold">{group.title}</h2>
          <div className="mt-3 space-y-3">
            {group.items.map(([q, a]) => (
              <details key={q} className="rounded-xl bg-white p-4 ring-1 ring-line">
                <summary className="cursor-pointer font-medium">{q}</summary>
                <p className="mt-2 text-sm text-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
