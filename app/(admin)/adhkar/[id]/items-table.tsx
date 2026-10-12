"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Eye, EyeOff, Trash2, Repeat } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AdhkarItem } from "@/lib/types";
import { toArabicDigits } from "@/lib/utils";

export function ItemsTable({
  items,
  categoryId,
}: {
  items: AdhkarItem[];
  categoryId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleActive(it: AdhkarItem) {
    setBusyId(it.id);
    const { error } = await supabase
      .from("adhkar_items")
      .update({ is_active: !it.is_active })
      .eq("id", it.id);
    setBusyId(null);
    if (error) return alert("تعذّر التحديث: " + error.message);
    router.refresh();
  }

  async function remove(it: AdhkarItem) {
    if (!confirm("حذف هذا الذكر نهائياً؟")) return;
    setBusyId(it.id);
    const { error } = await supabase
      .from("adhkar_items")
      .delete()
      .eq("id", it.id);
    setBusyId(null);
    if (error) return alert("تعذّر الحذف: " + error.message);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-3xl border border-hairline overflow-hidden">
      <div className="divide-y divide-hairline">
        {items.map((it) => (
          <div key={it.id} className="p-5 hover:bg-cream/40 transition">
            <div className="flex items-start gap-3">
              <span
                className={
                  "w-2 h-2 rounded-full mt-3 shrink-0 " +
                  (it.is_active ? "bg-success" : "bg-ink-muted")
                }
                title={it.is_active ? "نشط" : "متوقف"}
              />

              <div className="flex-1 min-w-0">
                <div
                  className="text-ink leading-relaxed"
                  style={{ fontFamily: "Amiri, serif", fontSize: 18 }}
                >
                  {it.text}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-ink-soft">
                  {it.repeat_count > 1 && (
                    <span className="inline-flex items-center gap-1 bg-cream rounded-full px-2.5 py-1">
                      <Repeat size={12} />×{toArabicDigits(it.repeat_count)}
                    </span>
                  )}
                  {it.source && (
                    <span className="text-gold">{it.source}</span>
                  )}
                  {it.note && (
                    <span className="text-ink-muted">— {it.note}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleActive(it)}
                  disabled={busyId === it.id}
                  className="p-2 text-ink-soft hover:bg-cream rounded-lg transition disabled:opacity-50"
                  title={it.is_active ? "إيقاف" : "تفعيل"}
                >
                  {it.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <Link
                  href={`/adhkar/${categoryId}/items/${it.id}`}
                  className="p-2 text-ink-soft hover:bg-cream rounded-lg transition"
                  title="تعديل"
                >
                  <Pencil size={18} />
                </Link>
                <button
                  onClick={() => remove(it)}
                  disabled={busyId === it.id}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg transition disabled:opacity-50"
                  title="حذف"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
