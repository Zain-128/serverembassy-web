import type { Category } from "@/types/store";

export function flattenCategories(nodes: Category[]): Category[] {
  const out: Category[] = [];
  const walk = (list: Category[]) => {
    for (const node of list) {
      out.push(node);
      if (node.children?.length) walk(node.children);
    }
  };
  walk(nodes);
  return out;
}

export function navCategories(tree: Category[], max = 5): Category[] {
  const preferred = flattenCategories(tree).filter((c) => c.showOnHomepage);
  const source = preferred.length ? preferred : tree;
  const seen = new Set<string>();
  const items: Category[] = [];
  for (const cat of source) {
    if (seen.has(cat.slug)) continue;
    seen.add(cat.slug);
    items.push(cat);
    if (items.length >= max) break;
  }
  return items;
}
