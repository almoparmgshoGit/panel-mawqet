"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Toggle } from "@/components/toggle";
import { api } from "@/lib/api";

interface FeatureFlag {
  key: string;
  label_ar: string;
  description_ar: string | null;
  enabled: boolean;
  updated_at: string;
}

const FEATURE_FLAGS: Array<{ key: string; label: string; description: string }> = [
  {
    key: "posts_create",
    label: "إنشاء المنشورات",
    description: "السماح للمستخدمين بإنشاء منشورات جديدة (آيات، أحاديث، أدعية، تذكيرات) في صفحة المجتمع",
  },
  {
    key: "janazah_create",
    label: "إعلانات الجنازات",
    description: "السماح للمستخدمين بإنشاء إعلانات الجنازات في صفحة المجتمع",
  },
];

export default function SettingsPage() {
  const [flags, setFlags] = useState<Map<string, FeatureFlag>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadFlags();
  }, []);

  async function loadFlags() {
    try {
      const data = await api.getFeatureFlags();
      const map = new Map<string, FeatureFlag>();
      (data ?? []).forEach((f: FeatureFlag) => map.set(f.key, f));
      setFlags(map);
    } catch (e: any) {
      setMessage({ type: "error", text: "تعذّر تحميل الإعدادات: " + (e.message || e) });
    } finally {
      setLoading(false);
    }
  }

  async function toggleFlag(key: string, currentValue: boolean) {
    setSaving(key);
    setMessage(null);
    try {
      await api.updateFeatureFlag(key, !currentValue);
      setFlags((prev) => {
        const next = new Map(prev);
        const flag = next.get(key);
        if (flag) next.set(key, { ...flag, enabled: !currentValue, updated_at: new Date().toISOString() });
        return next;
      });
      setMessage({ type: "success", text: "تم تحديث الإعداد بنجاح" });
    } catch (e: any) {
      setMessage({ type: "error", text: "تعذّر الحفظ: " + (e.message || e) });
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-forest" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink">الإعدادات</h1>
        <p className="text-ink-soft mt-1">إدارة ميزات التطبيق والمفاتيح العامة</p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-xl px-4 py-3 flex items-center gap-3 ${
            message.type === "success"
              ? "bg-success/10 border border-success/20 text-success"
              : "bg-danger/10 border border-danger/20 text-danger"
          }`}
        >
          {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-hairline overflow-hidden">
        <div className="p-6 border-b border-hairline">
          <h2 className="text-xl font-bold text-ink">مفاتيح الميزات (Feature Flags)</h2>
          <p className="text-ink-soft mt-1 text-sm">
            تفعيل أو تعطيل الميزات الرئيسية في التطبيق. التغييرات تنعكس فوراً على المستخدمين.
          </p>
        </div>

        <div className="divide-y divide-hairline">
          {FEATURE_FLAGS.map((ff) => {
            const flag = flags.get(ff.key);
            const enabled = flag?.enabled ?? true;
            const isSaving = saving === ff.key;
            return (
              <div key={ff.key} className="p-6 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-ink">{ff.label}</div>
                  <div className="text-sm text-ink-soft mt-0.5">{ff.description}</div>
                  {flag && (
                    <div className="text-xs text-ink-muted mt-1">
                      آخر تحديث: {new Date(flag.updated_at).toLocaleString("ar-SA")}
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  <Toggle
                    checked={enabled}
                    onChange={() => toggleFlag(ff.key, enabled)}
                    disabled={isSaving}
                    size={48}
                    className={enabled ? "text-forest" : "text-ink-muted"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
