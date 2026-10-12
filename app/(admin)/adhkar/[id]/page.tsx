import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, ArrowRight, BookHeart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  type AdhkarCategory,
  type AdhkarItem,
  type AdhkarSlot,
  SLOT_LABEL,
} from "@/lib/types";
import { ItemsTable } from "./items-table";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadCategory(id: string) {
  const supabase = await createClient();
  const [catRes, itemsRes] = await Promise.all([
    supabase.from("adhkar_categories").select("*").eq("id", id).single(),
    supabase
      .from("adhkar_items")
      .select("*")
      .eq("category_id", id)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  return {
    category: catRes.data as AdhkarCategory | null,
    items: (itemsRes.data ?? []) as AdhkarItem[],
  };
}

export default async function CategoryItemsPage({ params }: PageProps) {
  const { id } = await params;
  const { category, items } = await loadCategory(id);

  if (!category) notFound();

  return (
    <div>
      <Link
        href="/adhkar"
        className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-3"
      >
        <ArrowRight size={14} />
        كل الأذكار
      </Link>

      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-cream shrink-0"
            style={{
              background: "linear-gradient(135deg, #2D4A3E 0%, #1F352C 100%)",
            }}
          >
            <BookHeart size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ink">{category.title_ar}</h1>
            <p className="text-ink-soft mt-1">
              {category.slot
                ? SLOT_LABEL[category.slot as AdhkarSlot]
                : "بدون تصنيف"}
              {!category.is_active && (
                <span className="mr-2 text-xs bg-ink-muted/20 text-ink-muted rounded-full px-2 py-0.5">
                  متوقفة
                </span>
              )}
            </p>
          </div>
        </div>

        <Link
          href={`/adhkar/${category.id}/items/new`}
          className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition shrink-0"
        >
          <Plus size={18} />
          ذكر جديد
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-hairline p-12 text-center">
          <div className="text-ink-soft mb-4">لا توجد أذكار في هذه الفئة</div>
          <Link
            href={`/adhkar/${category.id}/items/new`}
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition"
          >
            <Plus size={18} />
            أضف أول ذكر
          </Link>
        </div>
      ) : (
        <ItemsTable items={items} categoryId={category.id} />
      )}
    </div>
  );
}
