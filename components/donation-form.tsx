"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Save, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import {
  type Donation,
  type DonationInput,
  type DonationPalette,
  PALETTE_LABEL,
} from "@/lib/types";
import { ImageUploader } from "./image-uploader";
import { DonationCardPreview } from "./donation-card-preview";

const COUNTRIES = [
  { code: "", label: "جميع البلدان (عام - يظهر للجميع)" },
  { code: "SA", label: "المملكة العربية السعودية (SA)" },
  { code: "EG", label: "جمهورية مصر العربية (EG)" },
  { code: "AE", label: "الإمارات العربية المتحدة (AE)" },
  { code: "KW", label: "دولة الكويت (KW)" },
  { code: "QA", label: "دولة قطر (QA)" },
  { code: "BH", label: "مملكة البحرين (BH)" },
  { code: "OM", label: "سلطنة عمان (OM)" },
  { code: "JO", label: "المملكة الأردنية الهاشمية (JO)" },
  { code: "LB", label: "لبنان (LB)" },
  { code: "SY", label: "سوريا (SY)" },
  { code: "IQ", label: "العراق (IQ)" },
  { code: "MA", label: "المغرب (MA)" },
  { code: "DZ", label: "الجزائر (DZ)" },
  { code: "TN", label: "تونس (TN)" },
  { code: "SD", label: "السودان (SD)" },
];

interface Props {
  initial?: Donation;
}

export function DonationForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial;

  const [titleAr, setTitleAr] = useState(initial?.title_ar ?? "");
  const [orgAr, setOrgAr] = useState(initial?.org_ar ?? "");
  const [descriptionAr, setDescriptionAr] = useState(initial?.description_ar ?? "");
  const [linkUrl, setLinkUrl] = useState(initial?.link_url ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.image_url ?? null);
  const [bgPalette, setBgPalette] = useState<DonationPalette>(initial?.bg_palette ?? "forest");
  const [countryCode, setCountryCode] = useState(initial?.country_code ?? "");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!linkUrl.startsWith("https://") && !linkUrl.startsWith("http://")) {
      setError("رابط التبرع يجب أن يبدأ بـ http:// أو https://");
      return;
    }

    setSaving(true);

    const payload: DonationInput = {
      title_ar: titleAr.trim(),
      org_ar: orgAr.trim(),
      description_ar: descriptionAr.trim() || null,
      image_url: imageUrl,
      link_url: linkUrl.trim(),
      bg_palette: bgPalette,
      is_active: isActive,
      country_code: countryCode.trim() ? countryCode.trim().toUpperCase() : null,
    };

    try {
      if (isEdit) {
        await api.updateDonation(initial!.id, payload);
      } else {
        await api.createDonation(payload);
      }
      router.push("/donations");
      router.refresh();
    } catch (err: any) {
      setError("تعذّر الحفظ: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!initial) return;
    if (!confirm(`حذف "${initial.title_ar}" نهائياً؟`)) return;
    setDeleting(true);
    try {
      await api.deleteDonation(initial.id);
      router.push("/donations");
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
          href="/donations"
          className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-3"
        >
          <ArrowRight size={14} />
          الرجوع إلى التبرعات
        </Link>
        <h1 className="text-3xl font-bold text-ink">
          {isEdit ? "تعديل تبرع" : "إضافة تبرع"}
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Form */}
        <form onSubmit={onSave} className="bg-white rounded-3xl border border-hairline p-6 space-y-5">
          <Field label="العنوان">
            <input
              type="text"
              required
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              className={inputClass}
              placeholder="مثال: كفالة يتيم"
            />
          </Field>

          <Field label="الجهة">
            <input
              type="text"
              required
              value={orgAr}
              onChange={(e) => setOrgAr(e.target.value)}
              className={inputClass}
              placeholder="مثال: جمعية الأيتام"
            />
          </Field>

          <Field label="الوصف (اختياري)">
            <textarea
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="نص قصير عن الحملة"
            />
          </Field>

          <Field label="رابط التبرع">
            <input
              type="url"
              required
              dir="ltr"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className={inputClass}
              placeholder="https://example.com/donate"
            />
          </Field>

          <ImageUploader value={imageUrl} onChange={setImageUrl} />

          <Field label="لون الخلفية">
            <select
              value={bgPalette}
              onChange={(e) => setBgPalette(e.target.value as DonationPalette)}
              className={inputClass}
            >
              {(Object.keys(PALETTE_LABEL) as DonationPalette[]).map((k) => (
                <option key={k} value={k}>
                  {PALETTE_LABEL[k]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="الدولة المستهدفة">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className={inputClass}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
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

        {/* Live preview */}
        <div className="space-y-3 lg:sticky lg:top-8 self-start">
          <div className="text-sm font-medium text-ink-soft">معاينة مباشرة</div>
          <DonationCardPreview
            titleAr={titleAr || "العنوان"}
            orgAr={orgAr || "الجهة"}
            imageUrl={imageUrl}
            palette={bgPalette}
          />
          <div className="bg-white rounded-2xl border border-hairline p-4 text-xs text-ink-soft">
            هكذا تظهر البطاقة في الصفحة الرئيسية للتطبيق.
          </div>
        </div>
      </div>
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
