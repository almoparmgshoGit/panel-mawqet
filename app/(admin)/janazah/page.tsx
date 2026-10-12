import Link from "next/link";
import { Plus, HeartCrack } from "lucide-react";
import { api } from "@/lib/api";
import type { Janazah } from "@/lib/types";
import { JanazahTable } from "./janazah-table";

async function getJanazah(): Promise<Janazah[]> {
  try {
    return await api.getJanazahs();
  } catch (error) {
    console.error("Janazah fetch error:", error);
    return [];
  }
}

export default async function JanazahPage() {
  const items = await getJanazah();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink">الجنازات</h1>
          <p className="text-ink-soft mt-1">
            إعلانات الصلاة على الجنازة في المساجد
          </p>
        </div>
        <Link
          href="/janazah/new"
          className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition"
        >
          <Plus size={18} />
          إعلان جديد
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-hairline p-12 text-center">
          <HeartCrack size={32} className="mx-auto text-ink-muted mb-3" />
          <div className="text-ink-soft mb-4">لا توجد إعلانات بعد</div>
          <Link
            href="/janazah/new"
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition"
          >
            <Plus size={18} />
            أضف أول إعلان
          </Link>
        </div>
      ) : (
        <JanazahTable items={items} />
      )}
    </div>
  );
}
