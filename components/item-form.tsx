"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AdhkarItem, AdhkarItemInput } from "@/lib/types";

interface Props {
  categoryId: string;
  categoryTitle: string;
  initial?: AdhkarItem;
}

export function ItemForm({ categoryId, categoryTitle, initial }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!initial;

  const [text, setText] = useState(initial?.text ?? "");
  const [source, setSource] = useState(initial?.source ?? "");
  const [repeatCount, setRepeatCount] = useState(initial?.repeat_count ?? 1);
  const [note, setNote] = useState(initial?.note ?? "");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (text.trim().length < 5) {
      setError("النص قصير جداً (٥ أحرف على الأقل)");
      return;
    }

    const rc = Number(repeatCount);
    if (!Number.isFinite(rc) || rc < 1 || rc > 1000) {
      setError("التكرار يجب أن يكون بين ١ و ١٠٠٠");
      return;
    }

    setSaving(true);

    const payload: AdhkarItemInput = {
      category_id: categoryId,
      text: text.trim(),
      source: source.trim() || null,
      repeat_count: rc,
      note: note.trim() || null,
      is_active: isActive,
    };

    const { error } = isEdit
      ? await supabase.from("adhkar_items").update(payload).eq("id", initial!.id)
      : await supabase.from("adhkar_items").insert(payload);

    setSaving(false);

    if (error) {
      setError("تعذّر الحفظ: " + error.message);
      return;
    }

    router.push(`/adhkar/${categoryId}`);
    router.refresh();
  }

  async function onDelete() {
    if (!initial) return;
    if (!confirm("حذف هذا الذكر نهائياً؟")) return;
    setDeleting(true);
    const { error } = await supabase
      .from("adhkar_items")
      .delete()
      .eq("id", initial.id);
    setDeleting(false);
    if (error) {
      setError("تعذّر الحذف: " + error.message);
      return;
    }
    router.push(`/adhkar/${categoryId}`);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/adhkar/${categoryId}`}
          className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-3"
        >
          <ArrowRight size={14} />
          {categoryTitle}
        </Link>
        <h1 className="text-3xl font-bold text-ink">
          {isEdit ? "تعديل ذكر" : "ذكر جديد"}
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <form
          onSubmit={onSave}
          className="bg-white rounded-3xl border border-hairline p-6 space-y-5"
        >
          <Field label="النص">
            <textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className={inputClass}
              placeholder="اكتب نص الذكر هنا..."
              style={{ fontFamily: "Amiri, serif", fontSize: 18, lineHeight: 1.9 }}
            />
          </Field>

          <Field label="المصدر (اختياري)">
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className={inputClass}
              placeholder="مثال: صحيح البخاري"
            />
          </Field>

          <Field label="عدد التكرار">
            <input
              type="text"
              inputMode="numeric"
              dir="ltr"
              value={repeatCount}
              onChange={(e) => {
                // Accept Arabic digits and convert to English
                const cleaned = e.target.value.replace(/[٠-٩]/g, (d) =>
                  String("٠١٢٣٤٥٦٧٨٩".indexOf(d)),
                );
                if (cleaned === "") {
                  setRepeatCount(1);
                  return;
                }
                const n = parseInt(cleaned, 10);
                if (!isNaN(n) && n >= 1 && n <= 1000) {
                  setRepeatCount(n);
                }
              }}
              className={inputClass}
              placeholder="1"
            />
          </Field>

          <Field label="ملاحظة (اختيارية)">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputClass}
              placeholder="معلومة إضافية تظهر تحت النص"
            />
          </Field>

          <label className="flex items-center gap-3 cursor-pointer select-none py-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 accent-forest"
            />
            <span className="text-sm font-medium text-ink">
              نشط — يظهر في التطبيق
            </span>
          </label>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-hairline">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "جارٍ الحفظ..." : isEdit ? "حفظ التغييرات" : "إضافة"}
            </button>

            {isEdit && (
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 text-danger hover:bg-danger/10 rounded-xl px-4 py-2.5 transition disabled:opacity-50 mr-auto"
              >
                <Trash2 size={18} />
                {deleting ? "جارٍ الحذف..." : "حذف"}
              </button>
            )}
          </div>
        </form>

        {/* Live preview */}
        <div className="space-y-3 lg:sticky lg:top-8 self-start">
          <div className="text-sm font-medium text-ink-soft">معاينة</div>
          <div className="bg-white rounded-2xl border border-hairline p-6">
            <div
              className="text-ink leading-relaxed"
              style={{
                fontFamily: "Amiri, serif",
                fontSize: 22,
                lineHeight: 1.9,
              }}
            >
              {text || "اكتب النص..."}
            </div>
            {(source || repeatCount > 1 || note) && (
              <div className="mt-4 pt-4 border-t border-hairline space-y-1.5 text-sm">
                {source && <div className="text-gold">{source}</div>}
                {repeatCount > 1 && (
                  <div className="text-ink-soft">
                    تُكرَّر ×{toArabic(repeatCount)}
                  </div>
                )}
                {note && <div className="text-ink-muted">{note}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function toArabic(n: number) {
  const ar = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(n).replace(/[0-9]/g, (d) => ar[Number(d)]);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-ink-soft block">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-cream border border-hairline rounded-xl px-4 py-2.5 text-ink outline-none focus:border-forest transition";
