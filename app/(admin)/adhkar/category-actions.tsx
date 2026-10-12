"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import type { AdhkarCategory } from "@/lib/types";

export function CategoryActions({ category }: { category: AdhkarCategory }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleActive() {
    setBusy(true);
    try {
      await api.updateAdhkarCategory(category.id, { is_active: !category.is_active });
    } catch (error: any) {
      alert("تعذّر التحديث: " + error.message);
    } finally {
      setBusy(false);
      router.refresh();
    }
  }

  async function remove() {
    if (
      !confirm(
        `حذف الفئة "${category.title_ar}" وكل أذكارها نهائياً؟`,
      )
    )
      return;
    setBusy(true);
    try {
      await api.deleteAdhkarCategory(category.id);
    } catch (error: any) {
      alert("تعذّر الحذف: " + error.message);
    } finally {
      setBusy(false);
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={toggleActive}
        disabled={busy}
        className="p-2 text-ink-soft hover:bg-cream rounded-lg transition disabled:opacity-50"
        title={category.is_active ? "إيقاف" : "تفعيل"}
      >
        {category.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
      <Link
        href={`/adhkar/${category.id}/edit`}
        className="p-2 text-ink-soft hover:bg-cream rounded-lg transition"
        title="تعديل"
      >
        <Pencil size={18} />
      </Link>
      <button
        onClick={remove}
        disabled={busy}
        className="p-2 text-danger hover:bg-danger/10 rounded-lg transition disabled:opacity-50"
        title="حذف"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
