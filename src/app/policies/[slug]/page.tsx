import { notFound } from "next/navigation";
import { getCmsPageBySlug } from "@/lib/api/store";

export const dynamic = "force-dynamic";

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
      <p className="mt-4 leading-relaxed text-muted">{page.body}</p>
    </div>
  );
}
