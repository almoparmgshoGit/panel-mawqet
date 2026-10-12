"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Save, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import {
  type AdhkarCategory,
  type AdhkarCategoryInput,
  type AdhkarSlot,
  SLOT_LABEL,
} from "@/lib/types";

interface Props {
  initial?: AdhkarCategory;
}

export function CategoryForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial;

  const [titleAr, setTitleAr] = useState(initial?.title_ar ?? "");
  const [slot, setSlot] = useState<AdhkarSlot | "">(
    (initial?.slot as AdhkarSlot | null) ?? "",
  );
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (titleAr.trim().length < 2) {
      setError("العنوان قصير جداً");
      return;
    }

    setSaving(true);

    const payload: AdhkarCategoryInput = {
      title_ar: titleAr.trim(),
      slot: slot === "" ? null : (slot as AdhkarSlot),
      is_active: isActive,
    };

    try {
      if (isEdit) {
        await api.updateAdhkarCategory(initial!.id, payload);
      } else {
        await api.createAdhkarCategory(payload);
      }
      router.push("/adhkar");
      router.refresh();
    } catch (err: any) {
      setError("تعذّر الحفظ: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!initial) return;
    if (!confirm(`حذف "${initial.title_ar}" وكل أذكارها نهائياً؟`)) return;
    setDeleting(true);
    try {
      await api.deleteAdhkarCategory(initial.id);
      router.push("/adhkar");
      router.refresh();
    } catch (err: any) {
      setError("تعذّر الحذف: " + (err.message || err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/adhkar"
          className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-3"
        >
          <ArrowRight size={14} />
          الرجوع إلى الأذكار
        </Link>
        <h1 className="text-3xl font-bold text-ink">
          {isEdit ? "تعديل فئة" : "فئة جديدة"}
        </h1>
      </div>

      <form
        onSubmit={onSave}
        className="bg-white rounded-3xl border border-hairline p-6 space-y-5 max-w-2xl"
      >
        <Field label="العنوان">
          <input
            type="text"
            required
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            className={inputClass}
            placeholder="مثال: أذكار بعد الصلاة"
          />
        </Field>

        <Field label="التصنيف الزمني (اختياري)">
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value as AdhkarSlot | "")}
            className={inputClass}
          >
            <option value="">— بدون —</option>
            {(Object.keys(SLOT_LABEL) as AdhkarSlot[]).map((k) => (
              <option key={k} value={k}>
                {SLOT_LABEL[k]}
              </option>
            ))}
          </select>
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
