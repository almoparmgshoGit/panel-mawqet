"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  type AfterPrayer,
  type JanazahInput,
  AFTER_PRAYER_LABEL,
} from "@/lib/types";

const ADMIN_DEVICE_HASH = "admin-panel-web";

export function JanazahForm() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mosque, setMosque] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [afterPrayer, setAfterPrayer] = useState<AfterPrayer>("dhuhr");
  const [customTime, setCustomTime] = useState("");
  const [burial, setBurial] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 3) {
      setError("الاسم قصير جداً");
      return;
    }
    if (mosque.trim().length < 2) {
      setError("اسم المسجد مطلوب");
      return;
    }
    if (city.trim().length < 2) {
      setError("اسم المدينة مطلوب");
      return;
    }
    if (afterPrayer === "custom" && !customTime) {
      setError("اختر وقت مخصص");
      return;
    }

    setSaving(true);

    // expires 2 days after creation by default; if custom_time is set, expires
    // a day after the custom time
    const expiry = new Date();
    if (afterPrayer === "custom" && customTime) {
      expiry.setTime(new Date(customTime).getTime() + 24 * 60 * 60 * 1000);
    } else {
      expiry.setDate(expiry.getDate() + 2);
    }

    const payload: JanazahInput = {
      name: name.trim(),
      age: age.trim() || null,
      mosque: mosque.trim(),
      district: district.trim() || null,
      city: city.trim(),
      after_prayer: afterPrayer,
      custom_time:
        afterPrayer === "custom" && customTime
          ? new Date(customTime).toISOString()
          : null,
      burial: burial.trim() || null,
      expires_at: expiry.toISOString(),
      status: "active",
      device_hash: ADMIN_DEVICE_HASH,
    };

    const { error } = await supabase
      .from("janazah_announcements")
      .insert(payload);
    setSaving(false);

    if (error) {
      setError("تعذّر الحفظ: " + error.message);
      return;
    }

    router.push("/janazah");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/janazah"
          className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-3"
        >
          <ArrowRight size={14} />
          الرجوع إلى الجنازات
        </Link>
        <h1 className="text-3xl font-bold text-ink">إعلان جنازة جديد</h1>
        <p className="text-ink-soft mt-1 text-sm">
          المعلومات تظهر في صفحة المجتمع للمستخدمين في نفس المدينة.
        </p>
      </div>

      <form
        onSubmit={onSave}
        className="bg-white rounded-3xl border border-hairline p-6 space-y-5 max-w-3xl"
      >
        <div className="grid sm:grid-cols-[1fr_120px] gap-4">
          <Field label="الاسم">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="مثال: محمد بن عبدالله الأحمدي"
            />
          </Field>

          <Field label="العمر (اختياري)">
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={inputClass}
              placeholder="مثال: ٧٠"
            />
          </Field>
        </div>

        <Field label="المسجد">
          <input
            type="text"
            required
            value={mosque}
            onChange={(e) => setMosque(e.target.value)}
            className={inputClass}
            placeholder="مثال: جامع الراجحي"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="المدينة">
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
              placeholder="الرياض"
            />
          </Field>

          <Field label="الحي (اختياري)">
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={inputClass}
              placeholder="حي العليا"
            />
          </Field>
        </div>

        <Field label="موعد الصلاة">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(Object.keys(AFTER_PRAYER_LABEL) as AfterPrayer[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setAfterPrayer(k)}
                className={
                  "py-2.5 rounded-xl border text-sm transition " +
                  (afterPrayer === k
                    ? "bg-forest text-cream border-forest"
                    : "bg-cream text-ink-soft border-hairline hover:border-forest/40")
                }
              >
                {AFTER_PRAYER_LABEL[k]}
              </button>
            ))}
          </div>
        </Field>

        {afterPrayer === "custom" && (
          <Field label="الوقت المخصص">
            <input
              type="datetime-local"
              required
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              dir="ltr"
              className={inputClass}
            />
          </Field>
        )}

        <Field label="مكان الدفن (اختياري)">
          <input
            type="text"
            value={burial}
            onChange={(e) => setBurial(e.target.value)}
            className={inputClass}
            placeholder="مثال: مقبرة النسيم"
          />
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
            {saving ? "جارٍ النشر..." : "نشر الإعلان"}
          </button>
        </div>

        <p className="text-xs text-ink-muted">
          الإعلان يبقى مرئياً ٤٨ ساعة من النشر، أو ٢٤ ساعة بعد الوقت المخصص.
        </p>
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
