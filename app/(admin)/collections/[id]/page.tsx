import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, ArrowRight, Pencil, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  type KnowledgeCollection,
  type KnowledgeItem,
} from "@/lib/types";
import { toArabicDigits } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [colRes, itemsRes] = await Promise.all([
    supabase.from("knowledge_collections").select("*").eq("id", id).single(),
    supabase
      .from("knowledge_items")
      .select("*")
      .eq("collection_id", id)
      .order("order_index", { ascending: true }),
  ]);

  if (colRes.error || !colRes.data) notFound();

  const collection = colRes.data as KnowledgeCollection;
  const items = (itemsRes.data ?? []) as KnowledgeItem[];

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/collections"
          className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-3"
        >
          <ArrowRight size={14} />
          الرجوع إلى الأقسام
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-ink">{collection.title_ar}</h1>
            <p className="text-ink-soft mt-1">
              {collection.description_ar || "—"}
              {" · "}
              <span className="text-ink-muted font-mono text-sm" dir="ltr">
                {collection.slug}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/collections/${id}/edit`}
              className="inline-flex items-center gap-2 text-ink-soft hover:bg-cream rounded-xl px-4 py-2.5 transition border border-hairline"
            >
              <Pencil size={16} />
              تعديل القسم
            </Link>
            <Link
              href={`/collections/${id}/items/new`}
              className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition"
            >
              <Plus size={18} />
              عنصر جديد
            </Link>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-hairline p-12 text-center">
          <div className="text-ink-soft mb-4">لا توجد عناصر في هذا القسم بعد</div>
          <Link
            href={`/collections/${id}/items/new`}
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition"
          >
            <Plus size={18} />
            أضف أول عنصر
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-hairline overflow-hidden">
          <div className="divide-y divide-hairline">
            {items.map((it) => (
              <Link
                key={it.id}
                href={`/collections/${id}/items/${it.id}`}
                className="flex items-center gap-4 p-4 hover:bg-cream/40 transition"
              >
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-cream font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, #C9A661 0%, #8B6F47 100%)",
                  }}
                >
                  {toArabicDigits(it.order_index)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "w-2 h-2 rounded-full " +
                        (it.is_active ? "bg-success" : "bg-ink-muted")
                      }
                    />
                    <div className="font-bold text-ink truncate text-lg" dir="rtl">
                      {it.title_ar}
                    </div>
                  </div>
                  {it.detail_1 && (
                    <div className="text-sm text-ink-soft mt-0.5 truncate">
                      {it.detail_1.slice(0, 80)}
                      {it.detail_1.length > 80 ? "…" : ""}
                    </div>
                  )}
                </div>

                <ChevronLeft size={16} className="text-ink-muted shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
