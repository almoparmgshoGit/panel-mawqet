"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  type KnowledgeCollection,
  type KnowledgeItem,
  type KnowledgeItemInput,
} from "@/lib/types";

interface Props {
  collection: KnowledgeCollection;
  initial?: KnowledgeItem;
}

export function CollectionItemForm({ collection, initial }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!initial;

  const [orderIndex, setOrderIndex] = useState(initial?.order_index ?? 1);
  const [titleAr, setTitleAr] = useState(initial?.title_ar ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [detail1, setDetail1] = useState(initial?.detail_1 ?? "");
  const [detail2Text, setDetail2Text] = useState(initial?.detail_2_text ?? "");
  const [detail2Ref, setDetail2Ref] = useState(initial?.detail_2_ref ?? "");
  const [detail3, setDetail3] = useState(initial?.detail_3 ?? "");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (titleAr.trim().length < 1) return setError("العنوان مطلوب");
    if (orderIndex < 1) return setError("ترتيب العنصر يجب أن يكون 1 أو أكبر");

    setSaving(true);

    const payload: KnowledgeItemInput = {
      collection_id: collection.id,
      order_index: orderIndex,
      title_ar: titleAr.trim(),
      subtitle: subtitle.trim() || null,
      detail_1: detail1.trim() || null,
      detail_2_text: detail2Text.trim() || null,
      detail_2_ref: detail2Ref.trim() || null,
      detail_3: detail3.trim() || null,
      is_active: isActive,
    };

    const { error } = isEdit
      ? await supabase
          .from("knowledge_items")
          .update(payload)
          .eq("id", initial!.id)
      : await supabase.from("knowledge_items").insert(payload);

    setSaving(false);

    if (error) {
      setError("تعذّر الحفظ: " + error.message);
      return;
    }

    router.push(`/collections/${collection.id}`);
    router.refresh();
  }

  async function onDelete() {
    if (!initial) return;
    if (!confirm(`حذف «${initial.title_ar}» نهائياً؟`)) return;
    setDeleting(true);
    const { error } = await supabase
      .from("knowledge_items")
      .delete()
      .eq("id", initial.id);
    setDeleting(false);
    if (error) {
      setError("تعذّر الحذف: " + error.message);
      return;
    }
    router.push(`/collections/${collection.id}`);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/collections/${collection.id}`}
          className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-3"
        >
          <ArrowRight size={14} />
          الرجوع إلى «{collection.title_ar}»
        </Link>
        <h1 className="text-3xl font-bold text-ink">
          {isEdit ? "تعديل العنصر" : "عنصر جديد"}
        </h1>
      </div>

      <form
        onSubmit={onSave}
        className="bg-white rounded-3xl border border-hairline p-6 space-y-5 max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="الترتيب">
            <input
              type="number" required value={orderIndex} min={1}
              onChange={(e) => setOrderIndex(parseInt(e.target.value) || 1)}
              className={inputClass}
            />
          </Field>

          <Field label="العنوان الفرعي (اختياري)">
            <input
              type="text" value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className={inputClass}
              placeholder="مثال: Allah"
              dir="ltr"
            />
          </Field>
        </div>

        <Field label="العنوان الرئيسي (يظهر بحجم كبير)">
          <input
            type="text" required value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            className={inputClass + " text-lg font-bold"}
            placeholder={collection.slug === "divine-names" ? "اللَّهُ" : "البقرة"}
          />
        </Field>

        <Field label={collection.field_labels?.detail_1 ?? "التعريف"}>
          <textarea
            value={detail1} rows={4}
            onChange={(e) => setDetail1(e.target.value)}
            className={inputClass + " resize-none"}
            placeholder="النص التفصيلي..."
          />
        </Field>

        <div className="border-t border-hairline pt-5">
          <div className="text-sm font-medium text-ink-soft mb-3">
            {collection.field_labels?.detail_2 ?? "في القرآن"}
          </div>
          <div className="space-y-3">
            <Field label="النص">
              <textarea
                value={detail2Text} rows={3}
                onChange={(e) => setDetail2Text(e.target.value)}
                className={inputClass + " resize-none"}
                placeholder="مثال: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
              />
            </Field>
            <Field label="المرجع">
              <input
                type="text" value={detail2Ref}
                onChange={(e) => setDetail2Ref(e.target.value)}
                className={inputClass}
                placeholder="مثال: الفاتحة: 1"
              />
            </Field>
          </div>
        </div>

        <Field label={collection.field_labels?.detail_3 ?? "المصدر"}>
          <textarea
            value={detail3} rows={2}
            onChange={(e) => setDetail3(e.target.value)}
            className={inputClass + " resize-none"}
            placeholder="مثال: سنن الترمذي ٣٥٠٧"
          />
        </Field>

        <label className="flex items-center gap-3 cursor-pointer select-none py-2">
          <input
            type="checkbox" checked={isActive}
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
            type="submit" disabled={saving}
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "جارٍ الحفظ..." : isEdit ? "حفظ التغييرات" : "إضافة"}
          </button>

          {isEdit && (
            <button
              type="button" onClick={onDelete} disabled={deleting}
              className="inline-flex items-center gap-2 text-danger hover:bg-danger/10 rounded-xl px-4 py-2.5 transition disabled:opacity-50 mr-auto"
            >
              <Trash2 size={18} />
              {deleting ? "جارٍ الحذف..." : "حذف"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
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
