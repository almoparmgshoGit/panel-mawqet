"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  type CommunityPost,
  type PostKind,
  type PostStatus,
  POST_KIND_LABEL,
  POST_STATUS_LABEL,
} from "@/lib/types";
import { toArabicDigits, formatDate } from "@/lib/utils";

const KIND_GRADIENT: Record<PostKind, string> = {
  ayah: "linear-gradient(135deg, #2D4A3E 0%, #1F352C 100%)",
  hadith: "linear-gradient(135deg, #C9A661 0%, #8B6F47 100%)",
  dua: "linear-gradient(135deg, #3E6051 0%, #2D4A3E 100%)",
  reminder: "linear-gradient(135deg, #5C413B 0%, #3E2D2A 100%)",
};

const STATUS_COLOR: Record<PostStatus, string> = {
  active: "bg-success",
  pending: "bg-warning",
  hidden: "bg-ink-muted",
  deleted: "bg-danger",
};

export function PostsTable({ posts }: { posts: CommunityPost[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [kindFilter, setKindFilter] = useState<PostKind | "all">("all");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (kindFilter !== "all" && p.kind !== kindFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      return true;
    });
  }, [posts, kindFilter, statusFilter]);

  async function setStatus(p: CommunityPost, status: PostStatus) {
    setBusyId(p.id);
    const { error } = await supabase
      .from("community_posts")
      .update({
        status,
        moderated_at: new Date().toISOString(),
        moderated_reason: status === "hidden" ? "أخفاه المشرف" : null,
      })
      .eq("id", p.id);
    setBusyId(null);
    if (error) return alert("تعذّر التحديث: " + error.message);
    router.refresh();
  }

  async function remove(p: CommunityPost) {
    const preview = p.text.slice(0, 40) + (p.text.length > 40 ? "..." : "");
    if (!confirm(`حذف المنشور "${preview}" نهائياً؟`)) return;
    setBusyId(p.id);
    const { error } = await supabase
      .from("community_posts")
      .delete()
      .eq("id", p.id);
    setBusyId(null);
    if (error) return alert("تعذّر الحذف: " + error.message);
    router.refresh();
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-hairline p-4 mb-4 flex flex-wrap items-center gap-3">
        <Filter size={16} className="text-ink-soft" />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-ink-soft ml-1">النوع:</span>
          <FilterPill
            label="الكل"
            active={kindFilter === "all"}
            onClick={() => setKindFilter("all")}
          />
          {(Object.keys(POST_KIND_LABEL) as PostKind[]).map((k) => (
            <FilterPill
              key={k}
              label={POST_KIND_LABEL[k]}
              active={kindFilter === k}
              onClick={() => setKindFilter(k)}
            />
          ))}
        </div>
        <div className="w-px h-5 bg-hairline mx-1 hidden sm:block" />
        <div className="flex flex-wrap items-center gap-2">
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
        </div>
        <div className="text-xs text-ink-muted mr-auto">
          {toArabicDigits(filtered.length)} من {toArabicDigits(posts.length)}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-hairline overflow-hidden">
        <div className="divide-y divide-hairline">
          {filtered.map((p) => {
            const expired = new Date(p.expires_at) < new Date();
            return (
              <div key={p.id} className="p-5 hover:bg-cream/40 transition">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-cream text-xs font-medium"
                    style={{ background: KIND_GRADIENT[p.kind] }}
                  >
                    {POST_KIND_LABEL[p.kind]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={
                          "w-2 h-2 rounded-full shrink-0 " +
                          STATUS_COLOR[p.status]
                        }
                      />
                      <span className="text-xs text-ink-muted">
                        {POST_STATUS_LABEL[p.status]}
                      </span>
                      <span className="text-xs text-ink-muted">·</span>
                      <span className="text-xs text-ink-muted">
                        {formatDate(p.created_at)}
                      </span>
                      {p.reports_count > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs bg-danger/10 text-danger rounded-full px-2 py-0.5">
                          <AlertTriangle size={11} />
                          {toArabicDigits(p.reports_count)} بلاغ
                        </span>
                      )}
                      {expired && (
                        <span className="text-xs bg-ink-muted/10 text-ink-muted rounded-full px-2 py-0.5">
                          منتهٍ
                        </span>
                      )}
                    </div>

                    <div
                      className="text-ink leading-relaxed"
                      style={{ fontFamily: "Amiri, serif", fontSize: 16 }}
                    >
                      {p.text}
                    </div>

                    {(p.source || p.author) && (
                      <div className="mt-2 text-xs text-ink-soft flex items-center gap-2">
                        {p.source && <span className="text-gold">{p.source}</span>}
                        {p.author && (
                          <span className="text-ink-muted">— {p.author}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {p.status === "active" ? (
                      <button
                        onClick={() => setStatus(p, "hidden")}
                        disabled={busyId === p.id}
                        className="p-2 text-ink-soft hover:bg-cream rounded-lg transition disabled:opacity-50"
                        title="إخفاء"
                      >
                        <EyeOff size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setStatus(p, "active")}
                        disabled={busyId === p.id}
                        className="p-2 text-ink-soft hover:bg-cream rounded-lg transition disabled:opacity-50"
                        title="إظهار"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => remove(p)}
                      disabled={busyId === p.id}
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
              لا توجد منشورات تطابق الفلتر
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
