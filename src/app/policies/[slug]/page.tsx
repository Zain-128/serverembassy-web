import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCmsPageBySlug } from "@/lib/api/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug).catch(() => null);
  if (!page) return {};
  return {
    title: page.title,
    alternates: { canonical: `/policies/${page.slug}` },
  };
}

// CMS page bodies are a single plain-text field. Blank lines separate blocks;
// a block is rendered as a heading if every non-empty line in it starts with "## ",
// as a bullet list if every line starts with "- ", and as a paragraph otherwise.
function PolicyBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n\s*\n/);

  return (
    <div className="mt-4 space-y-4 leading-relaxed text-muted">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return null;

        if (lines.every((l) => l.startsWith("## "))) {
          return (
            <h2 key={i} className="pt-2 text-xl font-semibold text-navy">
              {lines.map((l) => l.slice(3)).join(" ")}
            </h2>
          );
        }

        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }

        return <p key={i}>{lines.join(" ")}</p>;
      })}
    </div>
  );
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let page;
  try {
    page = await getCmsPageBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="container-se max-w-3xl py-12">
      <h1 className="text-4xl font-bold text-navy">{page.title}</h1>
      <PolicyBody body={page.body} />
    </div>
  );
}
