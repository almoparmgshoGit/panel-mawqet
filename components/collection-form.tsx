"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  type KnowledgeCollection,
  type KnowledgeCollectionInput,
  DEFAULT_FIELD_LABELS,
} from "@/lib/types";

interface Props {
  initial?: KnowledgeCollection;
}

export function CollectionForm({ initial }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!initial;

  const [titleAr, setTitleAr] = useState(initial?.title_ar ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [descriptionAr, setDescriptionAr] = useState(initial?.description_ar ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "");
  const [displayOrder, setDisplayOrder] = useState(initial?.display_order ?? 100);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [label1, setLabel1] = useState(
    initial?.field_labels?.detail_1 ?? DEFAULT_FIELD_LABELS.detail_1,
  );
  const [label2, setLabel2] = useState(
    initial?.field_labels?.detail_2 ?? DEFAULT_FIELD_LABELS.detail_2,
  );
  const [label3, setLabel3] = useState(
    initial?.field_labels?.detail_3 ?? DEFAULT_FIELD_LABELS.detail_3,
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (titleAr.trim().length < 2) return setError("العنوان قصير جداً");
    if (slug.trim().length < 2) return setError("الـ slug قصير جداً");
    if (!/^[a-z0-9-]+$/.test(slug.trim())) {
      return setError("الـ slug يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام و - فقط");
    }

    setSaving(true);

    const payload: KnowledgeCollectionInput = {
      title_ar: titleAr.trim(),
      slug: slug.trim(),
      description_ar: descriptionAr.trim() || null,
      icon: icon.trim() || null,
      display_order: displayOrder,
      is_active: isActive,
      field_labels: {
        detail_1: label1.trim() || DEFAULT_FIELD_LABELS.detail_1,
        detail_2: label2.trim() || DEFAULT_FIELD_LABELS.detail_2,
        detail_3: label3.trim() || DEFAULT_FIELD_LABELS.detail_3,
      },
    };

    const { error } = isEdit
      ? await supabase
          .from("knowledge_collections")
          .update(payload)
          .eq("id", initial!.id)
      : await supabase.from("knowledge_collections").insert(payload);

    setSaving(false);

    if (error) {
      setError("تعذّر الحفظ: " + error.message);
      return;
    }

    router.push("/collections");
    router.refresh();
  }

  async function onDelete() {
    if (!initial) return;
    if (!confirm(`حذف «${initial.title_ar}» وكل عناصره نهائياً؟`)) return;
    setDeleting(true);
    const { error } = await supabase
      .from("knowledge_collections")
      .delete()
      .eq("id", initial.id);
    setDeleting(false);
    if (error) {
      setError("تعذّر الحذف: " + error.message);
      return;
    }
    router.push("/collections");
    router.refresh();
  }

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
        <h1 className="text-3xl font-bold text-ink">
          {isEdit ? "تعديل القسم" : "قسم جديد"}
        </h1>
      </div>

      <form
        onSubmit={onSave}
        className="bg-white rounded-3xl border border-hairline p-6 space-y-5 max-w-2xl"
      >
        <Field label="عنوان القسم بالعربية">
          <input
            type="text" required value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            className={inputClass}
            placeholder="مثال: معاني السور"
          />
        </Field>

        <Field label="الـ slug (يستخدم في الرابط)">
          <input
            type="text" required value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputClass + " font-mono"}
            placeholder="surah-meanings"
            dir="ltr"
            disabled={isEdit}
          />
          {isEdit && (
            <div className="text-xs text-ink-muted mt-1">
              لا يمكن تعديل الـ slug بعد الإنشاء (يُكسر الـ links الموجودة).
            </div>
          )}
        </Field>

        <Field label="الوصف القصير (يظهر تحت العنوان في التطبيق)">
          <input
            type="text" value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
            className={inputClass}
            placeholder="مثال: ١١٤ سورة"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="الأيقونة (إيموجي اختياري)">
            <input
              type="text" value={icon} maxLength={4}
              onChange={(e) => setIcon(e.target.value)}
              className={inputClass}
              placeholder="٩٩"
            />
          </Field>

          <Field label="ترتيب العرض">
            <input
              type="number" value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 100)}
              className={inputClass}
              min={0}
            />
          </Field>
        </div>

        <div className="border-t border-hairline pt-5">
          <div className="text-sm font-medium text-ink mb-3">
            تسميات الحقول (تظهر في صفحة تفاصيل العنصر)
          </div>
          <div className="space-y-3">
            <Field label="عنوان الحقل الأول">
              <input
                type="text" value={label1}
                onChange={(e) => setLabel1(e.target.value)}
                className={inputClass}
                placeholder="التعريف"
              />
            </Field>
            <Field label="عنوان الحقل الثاني">
              <input
                type="text" value={label2}
                onChange={(e) => setLabel2(e.target.value)}
                className={inputClass}
                placeholder="في القرآن"
              />
            </Field>
            <Field label="عنوان الحقل الثالث">
              <input
                type="text" value={label3}
                onChange={(e) => setLabel3(e.target.value)}
                className={inputClass}
                placeholder="المصدر"
              />
            </Field>
          </div>
        </div>

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
            {saving ? "جارٍ الحفظ..." : isEdit ? "حفظ التغييرات" : "إنشاء"}
          </button>

          {isEdit && (
            <button
              type="button" onClick={onDelete} disabled={deleting}
              className="inline-flex items-center gap-2 text-danger hover:bg-danger/10 rounded-xl px-4 py-2.5 transition disabled:opacity-50 mr-auto"
            >
              <Trash2 size={18} />
              {deleting ? "جارٍ الحذف..." : "حذف القسم"}
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
  "w-full bg-cream border border-hairline rounded-xl px-4 py-2.5 text-ink outline-none focus:border-forest transition disabled:opacity-60";
