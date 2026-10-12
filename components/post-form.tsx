"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/image-uploader";
import {
  type CommunityPostInput,
  type PostKind,
  POST_KIND_LABEL,
} from "@/lib/types";

const ADMIN_DEVICE_HASH = "admin-panel-web";

const EXPIRY_OPTIONS = [
  { days: 7, label: "أسبوع" },
  { days: 30, label: "شهر" },
  { days: 90, label: "٣ أشهر" },
  { days: 365, label: "سنة" },
];

export function PostForm() {
  const router = useRouter();
  const supabase = createClient();

  const [kind, setKind] = useState<PostKind>("ayah");
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [expiryDays, setExpiryDays] = useState(30);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = text.trim();
    if (trimmed.length < 5) {
      setError("النص قصير جداً (٥ أحرف على الأقل)");
      return;
    }
    if (trimmed.length > 500) {
      setError("النص أطول من اللازم (٥٠٠ حرف كحد أقصى)");
      return;
    }

    setSaving(true);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    const payload: CommunityPostInput = {
      kind,
      text: trimmed,
      source: source.trim() || null,
      author: author.trim() || null,
      image_url: imageUrl,
      expires_at: expiresAt.toISOString(),
      status: "active",
      device_hash: ADMIN_DEVICE_HASH,
    };

    const { error } = await supabase.from("community_posts").insert(payload);
    setSaving(false);

    if (error) {
      setError("تعذّر الحفظ: " + error.message);
      return;
    }

    router.push("/posts");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/posts"
          className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-3"
        >
          <ArrowRight size={14} />
          الرجوع إلى المنشورات
        </Link>
        <h1 className="text-3xl font-bold text-ink">منشور جديد</h1>
      </div>

      <form
        onSubmit={onSave}
        className="bg-white rounded-3xl border border-hairline p-6 space-y-5 max-w-3xl"
      >
        <Field label="النوع">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(POST_KIND_LABEL) as PostKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={
                  "py-2.5 rounded-xl border text-sm transition " +
                  (kind === k
                    ? "bg-forest text-cream border-forest"
                    : "bg-cream text-ink-soft border-hairline hover:border-forest/40")
                }
              >
                {POST_KIND_LABEL[k]}
              </button>
            ))}
          </div>
        </Field>

        <Field
          label={`النص (${text.trim().length}/٥٠٠)`}
        >
          <textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className={inputClass}
            placeholder="اكتب نص الآية أو الحديث أو الدعاء أو التذكير..."
            maxLength={500}
            style={{ fontFamily: "Amiri, serif", fontSize: 18, lineHeight: 1.9 }}
          />
        </Field>

        <Field label="المصدر (اختياري)">
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className={inputClass}
            placeholder="مثال: سورة البقرة - الآية ٢٥٥"
          />
        </Field>

        <Field label="المؤلف / الراوي (اختياري)">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={inputClass}
            placeholder="مثال: رواه البخاري"
          />
        </Field>

        <ImageUploader
          value={imageUrl}
          onChange={setImageUrl}
          bucket="community-images"
        />

        <Field label="مدة العرض">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {EXPIRY_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                type="button"
                onClick={() => setExpiryDays(opt.days)}
                className={
                  "py-2.5 rounded-xl border text-sm transition " +
                  (expiryDays === opt.days
                    ? "bg-forest text-cream border-forest"
                    : "bg-cream text-ink-soft border-hairline hover:border-forest/40")
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-ink-muted mt-1.5">
            بعد هذه المدة يختفي المنشور تلقائياً من التطبيق
          </div>
        </Field>

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
            {saving ? "جارٍ النشر..." : "نشر"}
          </button>
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
