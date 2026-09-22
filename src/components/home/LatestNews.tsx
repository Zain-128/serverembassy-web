"use client";

import Link from "next/link";

const posts = [
  {
    date: "27,Jun 2023",
    title: "BUYING CHEAP USED TRANSMISSIONS ISN'T AS RISKY AS YOU THINK",
    excerpt:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    href: "/shop",
    tone: "from-[#0a3d2e] via-[#14532d] to-[#052e16]",
    pattern: "radial-gradient(circle at 20% 30%, rgba(250,204,21,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(34,197,94,0.25), transparent 45%)",
  },
  {
    date: "27,Jun 2023",
    title: "BUYING CHEAP USED TRANSMISSIONS ISN'T AS RISKY AS YOU THINK",
    excerpt:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    href: "/shop",
    tone: "from-[#1e293b] via-[#334155] to-[#0f172a]",
    pattern: "linear-gradient(135deg, rgba(148,163,184,0.2) 0 2px, transparent 2px), linear-gradient(45deg, rgba(59,130,246,0.15) 0 1px, transparent 1px)",
  },
  {
    date: "27,Jun 2023",
    title: "BUYING CHEAP USED TRANSMISSIONS ISN'T AS RISKY AS YOU THINK",
    excerpt:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    href: "/shop",
    tone: "from-[#1e3a8a] via-[#1d4ed8] to-[#0c1a3d]",
    pattern: "radial-gradient(circle at 70% 40%, rgba(96,165,250,0.45), transparent 50%), radial-gradient(circle at 20% 80%, rgba(37,99,235,0.3), transparent 40%)",
  },
];

export default function LatestNews() {
  return (
    <section className="bg-[#05070c] text-white">
      <div className="container-se py-12 md:py-14">
        <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em] text-white sm:text-2xl">
            OUR LATEST NEWS
          </h2>
          <p className="text-sm text-white/50">Dont miss out on this waek deals</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post, index) => (
            <article key={`${post.title}-${index}`}>
              <Link
                href={post.href}
                className={`block aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-br ${post.tone} transition hover:ring-2 hover:ring-brand/50`}
                style={{ backgroundImage: post.pattern }}
                aria-label={post.title}
              />
              <p className="mt-4 text-xs text-white/45">{post.date}</p>
              <h3 className="mt-2 font-display text-sm font-bold uppercase leading-snug tracking-wide text-white">
                <Link href={post.href} className="transition hover:text-brand">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
