"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  Filter,
  MapPin,
  Building2,
  Clock,
  HeartCrack,
} from "lucide-react";
import { api } from "@/lib/api";
import {
  type Janazah,
  type PostStatus,
  AFTER_PRAYER_LABEL,
  POST_STATUS_LABEL,
} from "@/lib/types";
import { toArabicDigits, formatDate } from "@/lib/utils";

const STATUS_COLOR: Record<PostStatus, string> = {
  active: "bg-success",
  pending: "bg-warning",
  hidden: "bg-ink-muted",
  deleted: "bg-danger",
};

export function JanazahTable({ items }: { items: Janazah[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((it) => it.status === statusFilter);
  }, [items, statusFilter]);

  async function setStatus(j: Janazah, status: PostStatus) {
    setBusyId(j.id);
    try {
      await api.updateJanazah(j.id, {
        status,
        moderated_at: new Date().toISOString(),
        moderated_reason: status === "hidden" ? "أخفاه المشرف" : null,
      });
    } catch (error: any) {
      alert("تعذّر التحديث: " + error.message);
    } finally {
      setBusyId(null);
      router.refresh();
    }
  }

  async function remove(j: Janazah) {
    if (!confirm(`حذف إعلان جنازة "${j.name}" نهائياً؟`)) return;
    setBusyId(j.id);
    try {
      await api.deleteJanazah(j.id);
    } catch (error: any) {
      alert("تعذّر الحذف: " + error.message);
    } finally {
      setBusyId(null);
      router.refresh();
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-hairline p-4 mb-4 flex flex-wrap items-center gap-3">
        <Filter size={16} className="text-ink-soft" />
        <span className="text-sm text-ink-soft ml-1">الحالة:</span>
        <FilterPill
          label="الكل"
          active={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
        />
        {(Object.keys(POST_STATUS_LABEL) as PostStatus[]).map((s) => (
          <FilterPill
            key={s}
            label={POST_STATUS_LABEL[s]}
            active={statusFilter === s}
            onClick={() => setStatusFilter(s)}
          />
        ))}
        <div className="text-xs text-ink-muted mr-auto">
          {toArabicDigits(filtered.length)} من {toArabicDigits(items.length)}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-hairline overflow-hidden">
        <div className="divide-y divide-hairline">
          {filtered.map((j) => {
            const expired = new Date(j.expires_at) < new Date();
            const prayerLabel = j.after_prayer
              ? AFTER_PRAYER_LABEL[j.after_prayer]
              : null;
            const customDate = j.custom_time
              ? new Date(j.custom_time)
              : null;

            return (
              <div key={j.id} className="p-5 hover:bg-cream/40 transition">
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-cream"
                    style={{
                      background:
                        "linear-gradient(135deg, #5C413B 0%, #3E2D2A 100%)",
                    }}
                  >
                    <HeartCrack size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={
                          "w-2 h-2 rounded-full shrink-0 " +
                          STATUS_COLOR[j.status]
                        }
                      />
                      <span className="text-xs text-ink-muted">
                        {POST_STATUS_LABEL[j.status]}
                      </span>
                      <span className="text-xs text-ink-muted">·</span>
                      <span className="text-xs text-ink-muted">
                        {formatDate(j.created_at)}
                      </span>
                      {j.reports_count > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs bg-danger/10 text-danger rounded-full px-2 py-0.5">
                          <AlertTriangle size={11} />
                          {toArabicDigits(j.reports_count)} بلاغ
                        </span>
                      )}
                      {expired && (
                        <span className="text-xs bg-ink-muted/10 text-ink-muted rounded-full px-2 py-0.5">
                          منتهٍ
                        </span>
                      )}
                    </div>

                    <div className="text-lg font-bold text-ink">
                      {j.name}
                      {j.age && (
                        <span className="text-sm font-normal text-ink-soft mr-2">
                          ({j.age})
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
                      <span className="inline-flex items-center gap-1">
                        <Building2 size={14} className="text-ink-muted" />
                        {j.mosque}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} className="text-ink-muted" />
                        {j.city}
                        {j.district && (
                          <span className="text-ink-muted"> — {j.district}</span>
                        )}
                      </span>
                      {prayerLabel && (
                        <span className="inline-flex items-center gap-1 text-gold">
                          <Clock size={14} />
                          {j.after_prayer === "custom" && customDate
                            ? customDate.toLocaleString("ar-SA", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
                            : prayerLabel}
                        </span>
                      )}
                    </div>

                    {j.burial && (
                      <div className="mt-1 text-xs text-ink-muted">
                        الدفن: {j.burial}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {j.status === "active" ? (
                      <button
                        onClick={() => setStatus(j, "hidden")}
                        disabled={busyId === j.id}
                        className="p-2 text-ink-soft hover:bg-cream rounded-lg transition disabled:opacity-50"
                        title="إخفاء"
                      >
                        <EyeOff size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setStatus(j, "active")}
                        disabled={busyId === j.id}
                        className="p-2 text-ink-soft hover:bg-cream rounded-lg transition disabled:opacity-50"
                        title="إظهار"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => remove(j)}
                      disabled={busyId === j.id}
                      className="p-2 text-danger hover:bg-danger/10 rounded-lg transition disabled:opacity-50"
                      title="حذف نهائي"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-12 text-center text-ink-muted text-sm">
              لا توجد إعلانات تطابق الفلتر
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "text-xs px-3 py-1.5 rounded-full border transition " +
        (active
          ? "bg-forest text-cream border-forest"
          : "bg-cream text-ink-soft border-hairline hover:border-forest/40")
      }
    >
      {label}
    </button>
  );
}
