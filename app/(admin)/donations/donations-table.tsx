"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { PALETTE_GRADIENT, type Donation } from "@/lib/types";

export function DonationsTable({ donations }: { donations: Donation[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleActive(d: Donation) {
    setBusyId(d.id);
    try {
      await api.updateDonation(d.id, { is_active: !d.is_active });
    } catch (error: any) {
      alert("تعذّر التحديث: " + error.message);
    } finally {
      setBusyId(null);
      router.refresh();
    }
  }

  async function remove(d: Donation) {
    if (!confirm(`حذف "${d.title_ar}" نهائياً؟`)) return;
    setBusyId(d.id);
    try {
      await api.deleteDonation(d.id);
    } catch (error: any) {
      alert("تعذّر الحذف: " + error.message);
    } finally {
      setBusyId(null);
      router.refresh();
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-hairline overflow-hidden">
      <div className="divide-y divide-hairline">
        {donations.map((d) => (
          <div
            key={d.id}
            className="flex items-center gap-4 p-4 hover:bg-cream/40 transition"
          >
            {/* Gradient strip */}
            <div
              className="w-16 h-16 rounded-xl shrink-0 relative overflow-hidden"
              style={{ background: PALETTE_GRADIENT[d.bg_palette] }}
            >
              {d.image_url && (
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `url(${d.image_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
            </div>

            {/* Title + org */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={
                    "w-2 h-2 rounded-full " +
                    (d.is_active ? "bg-success" : "bg-ink-muted")
                  }
                  title={d.is_active ? "نشط" : "متوقف"}
                />
                <div className="font-medium text-ink truncate">{d.title_ar}</div>
              </div>
              <div className="text-sm text-ink-soft truncate">{d.org_ar}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toggleActive(d)}
                disabled={busyId === d.id}
                className="p-2 text-ink-soft hover:bg-cream rounded-lg transition disabled:opacity-50"
                title={d.is_active ? "إيقاف" : "تفعيل"}
              >
                {d.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <Link
                href={`/donations/${d.id}`}
                className="p-2 text-ink-soft hover:bg-cream rounded-lg transition"
                title="تعديل"
              >
                <Pencil size={18} />
              </Link>
              <button
                onClick={() => remove(d)}
                disabled={busyId === d.id}
                className="p-2 text-danger hover:bg-danger/10 rounded-lg transition disabled:opacity-50"
                title="حذف"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
