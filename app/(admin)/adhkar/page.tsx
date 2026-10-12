import Link from "next/link";
import { Plus, BookHeart, ChevronLeft } from "lucide-react";
import { api } from "@/lib/api";
import { type AdhkarCategory, type AdhkarSlot, SLOT_LABEL } from "@/lib/types";
import { toArabicDigits } from "@/lib/utils";
import { CategoryActions } from "./category-actions";

interface CategoryWithCount extends AdhkarCategory {
  item_count: number;
}

async function getCategories(): Promise<CategoryWithCount[]> {
  try {
    const cats = await api.getAdhkarCategories();
    return (cats ?? []).map((c: any) => ({
      ...c,
      item_count: Array.isArray(c.items) ? c.items.length : 0,
    })) as CategoryWithCount[];
  } catch (error) {
    console.error("Adhkar categories fetch error:", error);
    return [];
  }
}

export default async function AdhkarPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink">الأذكار</h1>
          <p className="text-ink-soft mt-1">
            فئات الأذكار التي تظهر في تطبيق المستخدم
          </p>
        </div>
        <Link
          href="/adhkar/new"
          className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition"
        >
          <Plus size={18} />
          فئة جديدة
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-hairline p-4 mb-6 text-sm text-ink-soft flex items-start gap-3">
        <BookHeart size={18} className="text-gold mt-0.5 shrink-0" />
        <div>
          التطبيق يعرض <strong>٤٧ ذكرًا مدمجًا افتراضيًا</strong> (الصباح، المساء،
          النوم، الاستيقاظ، الصلاة) من حصن المسلم. أي فئة أو ذكر تضيفه هنا{" "}
          <strong>يظهر إضافيًا</strong> فوق المدمج.
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-3xl border border-hairline p-12 text-center">
          <div className="text-ink-soft mb-4">لا توجد فئات مخصصة بعد</div>
          <Link
            href="/adhkar/new"
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition"
          >
            <Plus size={18} />
            أضف أول فئة
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-hairline overflow-hidden">
          <div className="divide-y divide-hairline">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 p-4 hover:bg-cream/40 transition"
              >
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-cream"
                  style={{
                    background:
                      "linear-gradient(135deg, #2D4A3E 0%, #1F352C 100%)",
                  }}
                >
                  <BookHeart size={20} />
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
                  <div className="text-sm text-ink-soft mt-0.5">
                    {c.slot ? SLOT_LABEL[c.slot as AdhkarSlot] : "بدون تصنيف"}
                    {" · "}
                    <span className="text-ink-muted">
                      {toArabicDigits(c.item_count)} ذكر
                    </span>
                  </div>
                </div>

                <Link
                  href={`/adhkar/${c.id}`}
                  className="inline-flex items-center gap-1 text-sm text-forest hover:bg-cream rounded-lg px-3 py-2 transition"
                >
                  الأذكار
                  <ChevronLeft size={14} />
                </Link>

                <CategoryActions category={c} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
