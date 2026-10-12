import Link from "next/link";
import { Plus, Sparkles, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { type KnowledgeCollection, DEFAULT_FIELD_LABELS } from "@/lib/types";
import { toArabicDigits } from "@/lib/utils";

interface CollectionWithCount extends KnowledgeCollection {
  item_count: number;
}

async function getCollections(): Promise<CollectionWithCount[]> {
  const supabase = await createClient();
  const { data: cols, error } = await supabase
    .from("knowledge_collections")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !cols) {
    console.error("Collections fetch error:", error);
    return [];
  }

  const ids = (cols as any[]).map((c: any) => c.id);
  const counts = new Map<string, number>();
  if (ids.length) {
    const { data: items } = await supabase
      .from("knowledge_items")
      .select("collection_id")
      .in("collection_id", ids);
    for (const it of (items as any[]) ?? []) {
      counts.set(it.collection_id, (counts.get(it.collection_id) ?? 0) + 1);
    }
  }

  return (cols as any[]).map((c: any) => ({
    ...c,
    field_labels: c.field_labels || DEFAULT_FIELD_LABELS,
    item_count: counts.get(c.id) ?? 0,
  })) as CollectionWithCount[];
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink">الأقسام التعليمية</h1>
          <p className="text-ink-soft mt-1">
            الأقسام الإسلامية (مثل أسماء الله الحسنى، الأربعين النووية)
          </p>
        </div>
        <Link
          href="/collections/new"
          className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition"
        >
          <Plus size={18} />
          قسم جديد
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="bg-white rounded-3xl border border-hairline p-12 text-center">
          <div className="text-ink-soft mb-4">لا توجد أقسام بعد</div>
          <Link
            href="/collections/new"
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition"
          >
            <Plus size={18} />
            أضف أول قسم
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-hairline overflow-hidden">
          <div className="divide-y divide-hairline">
            {collections.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 p-4 hover:bg-cream/40 transition"
              >
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-cream"
                  style={{
                    background:
                      "linear-gradient(135deg, #3E6051 0%, #2D4A3E 100%)",
                  }}
                >
                  <Sparkles size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "w-2 h-2 rounded-full " +
                        (c.is_active ? "bg-success" : "bg-ink-muted")
                      }
                      title={c.is_active ? "نشط" : "متوقف"}
                    />
                    <div className="font-medium text-ink truncate">
                      {c.title_ar}
                    </div>
                  </div>
                  <div className="text-sm text-ink-soft mt-0.5 truncate">
                    {c.description_ar || c.slug}
                    {" · "}
                    <span className="text-ink-muted">
                      {toArabicDigits(c.item_count)} عنصر
                    </span>
                  </div>
                </div>

                <Link
                  href={`/collections/${c.id}`}
                  className="inline-flex items-center gap-1 text-sm text-forest hover:bg-cream rounded-lg px-3 py-2 transition"
                >
                  محتوى القسم
                  <ChevronLeft size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
