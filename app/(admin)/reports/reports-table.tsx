"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Filter,
  CheckCircle2,
  Circle,
  Trash2,
  Mail,
  Fingerprint,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  type UserFeedback,
  type FeedbackCategory,
  FEEDBACK_CATEGORY_LABEL,
  FEEDBACK_CATEGORY_GRADIENT,
} from "@/lib/types";
import { toArabicDigits, formatDate } from "@/lib/utils";

type ResolvedFilter = "all" | "open" | "done";

export function ReportsTable({
  items,
  unresolvedCount,
}: {
  items: UserFeedback[];
  unresolvedCount: number;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [resolvedFilter, setResolvedFilter] = useState<ResolvedFilter>("open");
  const [categoryFilter, setCategoryFilter] = useState<FeedbackCategory | "all">(
    "all",
  );

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (resolvedFilter === "open" && it.resolved) return false;
      if (resolvedFilter === "done" && !it.resolved) return false;
      if (categoryFilter !== "all" && it.category !== categoryFilter)
        return false;
      return true;
    });
  }, [items, resolvedFilter, categoryFilter]);

  async function toggleResolved(it: UserFeedback) {
    setBusyId(it.id);
    const { error } = await supabase
      .from("user_feedback")
      .update({ resolved: !it.resolved })
      .eq("id", it.id);
    setBusyId(null);
    if (error) return alert("تعذّر التحديث: " + error.message);
    router.refresh();
  }

  async function remove(it: UserFeedback) {
    if (!confirm("حذف هذا البلاغ نهائياً؟")) return;
    setBusyId(it.id);
    const { error } = await supabase
      .from("user_feedback")
      .delete()
      .eq("id", it.id);
    setBusyId(null);
    if (error) return alert("تعذّر الحذف: " + error.message);
    router.refresh();
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <StatCard
          label="غير محلول"
          value={unresolvedCount}
          accent="linear-gradient(135deg, #B5453E 0%, #8C342F 100%)"
        />
        <StatCard
          label="محلول"
          value={items.length - unresolvedCount}
          accent="linear-gradient(135deg, #5B8C5A 0%, #3F6B3E 100%)"
        />
        <StatCard
          label="الإجمالي"
          value={items.length}
          accent="linear-gradient(135deg, #2D4A3E 0%, #1F352C 100%)"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-hairline p-4 mb-4 flex flex-wrap items-center gap-3">
        <Filter size={16} className="text-ink-soft" />
        <span className="text-sm text-ink-soft ml-1">الحالة:</span>
        <FilterPill
          label="غير محلول"
          active={resolvedFilter === "open"}
          onClick={() => setResolvedFilter("open")}
        />
        <FilterPill
          label="محلول"
          active={resolvedFilter === "done"}
          onClick={() => setResolvedFilter("done")}
        />
        <FilterPill
          label="الكل"
          active={resolvedFilter === "all"}
          onClick={() => setResolvedFilter("all")}
        />

        <div className="w-px h-5 bg-hairline mx-1 hidden sm:block" />

        <span className="text-sm text-ink-soft ml-1">النوع:</span>
        <FilterPill
          label="الكل"
          active={categoryFilter === "all"}
          onClick={() => setCategoryFilter("all")}
        />
        {(Object.keys(FEEDBACK_CATEGORY_LABEL) as FeedbackCategory[]).map(
          (k) => (
            <FilterPill
              key={k}
              label={FEEDBACK_CATEGORY_LABEL[k]}
              active={categoryFilter === k}
              onClick={() => setCategoryFilter(k)}
            />
          ),
        )}

        <div className="text-xs text-ink-muted mr-auto">
          {toArabicDigits(filtered.length)} من {toArabicDigits(items.length)}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-hairline overflow-hidden">
        <div className="divide-y divide-hairline">
          {filtered.map((it) => (
            <div key={it.id} className="p-5 hover:bg-cream/40 transition">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-cream text-xs font-medium"
                  style={{
                    background: FEEDBACK_CATEGORY_GRADIENT[it.category],
                  }}
                >
                  {FEEDBACK_CATEGORY_LABEL[it.category].split(" ")[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {it.resolved ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success rounded-full px-2 py-0.5">
                        <CheckCircle2 size={11} />
                        محلول
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-warning/10 text-warning rounded-full px-2 py-0.5">
                        <Circle size={11} />
                        جديد
                      </span>
                    )}
                    <span className="text-xs text-ink-muted">·</span>
                    <span className="text-xs text-ink-muted">
                      {formatDate(it.created_at)}
                    </span>
                    <span className="text-xs text-ink-muted">·</span>
                    <span className="text-xs text-ink-soft">
                      {FEEDBACK_CATEGORY_LABEL[it.category]}
                    </span>
                  </div>

                  <div className="text-ink leading-relaxed whitespace-pre-wrap">
                    {it.message}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                    {it.contact_email && (
                      <a
                        href={`mailto:${it.contact_email}`}
                        className="inline-flex items-center gap-1 text-forest hover:underline"
                        dir="ltr"
                      >
                        <Mail size={12} />
                        {it.contact_email}
                      </a>
                    )}
                    <span
                      className="inline-flex items-center gap-1 text-ink-muted"
                      title={it.reporter_hash}
                    >
                      <Fingerprint size={12} />
                      <code className="text-[10px]">
                        {it.reporter_hash.slice(0, 12)}…
                      </code>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleResolved(it)}
                    disabled={busyId === it.id}
                    className={
                      "p-2 rounded-lg transition disabled:opacity-50 " +
                      (it.resolved
                        ? "text-ink-soft hover:bg-cream"
                        : "text-success hover:bg-success/10")
                    }
                    title={it.resolved ? "إعادة فتح" : "علّم كمحلول"}
                  >
                    {it.resolved ? (
                      <Circle size={18} />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => remove(it)}
                    disabled={busyId === it.id}
                    className="p-2 text-danger hover:bg-danger/10 rounded-lg transition disabled:opacity-50"
                    title="حذف نهائي"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-12 text-center text-ink-muted text-sm">
              لا توجد بلاغات تطابق الفلتر
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-hairline p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl shrink-0"
        style={{ background: accent }}
      />
      <div>
        <div className="text-xl font-bold text-ink">
          {toArabicDigits(value)}
        </div>
        <div className="text-xs text-ink-soft">{label}</div>
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
