import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { getCmsPageBySlug } from "@/lib/api/store";
import { STORE_CONTACT } from "@/lib/constants/contact";

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
    title: `${page.title} | ${STORE_CONTACT.companyName}`,
    alternates: { canonical: `/policies/${page.slug}` },
  };
}

function renderInlineLinks(text: string) {
  // Replace email and phone with clickable links
  const parts = text.split(/(info@powerlinedevices\.com|\(321\)\s*788-5899)/g);
  return parts.map((part, idx) => {
    if (part === "info@powerlinedevices.com") {
      return (
        <a key={idx} href={`mailto:${part}`} className="font-semibold text-[#0066ff] hover:underline">
          {part}
        </a>
      );
    }
    if (/\(321\)\s*788-5899/.test(part)) {
      return (
        <a key={idx} href={`tel:${STORE_CONTACT.phoneRaw}`} className="font-semibold text-[#0066ff] hover:underline">
          {part}
        </a>
      );
    }
    return part;
  });
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
            <h2 key={i} className="pt-3 text-xl font-bold text-navy">
              {lines.map((l) => l.slice(3)).join(" ")}
            </h2>
          );
        }

        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{renderInlineLinks(l.slice(2))}</li>
              ))}
            </ul>
          );
        }

        return <p key={i}>{renderInlineLinks(lines.join(" "))}</p>;
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
      <h1 className="text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">{page.title}</h1>
      <PolicyBody body={page.body} />

      {/* Official Contact Block on all Policy Pages */}
      <div className="mt-12 rounded-3xl bg-white p-6 sm:p-8 border border-line shadow-xs">
        <h3 className="text-lg font-bold text-navy">Questions Regarding This Policy?</h3>
        <p className="mt-1 text-sm text-muted">
          Our team is available to assist with any inquiries regarding our {page.title.toLowerCase()}:
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div className="flex items-start gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Direct Phone</p>
              <a
                href={`tel:${STORE_CONTACT.phoneRaw}`}
                className="mt-0.5 text-base font-bold text-navy hover:text-[#0066ff] transition"
              >
                {STORE_CONTACT.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Official Email</p>
              <a
                href={`mailto:${STORE_CONTACT.email}`}
                className="mt-0.5 text-base font-bold text-navy hover:text-[#0066ff] transition break-all"
              >
                {STORE_CONTACT.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3.5 sm:col-span-2 pt-2 border-t border-line">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Mailing Address</p>
              <p className="mt-0.5 font-semibold text-navy">
                {STORE_CONTACT.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
