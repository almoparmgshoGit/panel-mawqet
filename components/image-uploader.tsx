"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket?: string;
}

export function ImageUploader({ value, onChange, bucket = "donations" }: Props) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("الملف ليس صورة");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("الصورة أكبر من 5MB");
      return;
    }

    setUploading(true);

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (upErr) {
      setUploading(false);
      setError("فشل الرفع: " + upErr.message);
      return;
    }

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(pub.publicUrl);
    setUploading(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-ink-soft block">
        صورة الخلفية (اختيارية)
      </label>

      {value ? (
        <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-hairline group">
          <img src={value} alt="معاينة" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 left-2 bg-black/60 hover:bg-black/80 text-white rounded-lg p-2 transition"
            title="إزالة"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={
            "w-full h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition " +
            (dragOver
              ? "border-forest bg-forest/5"
              : "border-hairline hover:border-forest/40 hover:bg-cream")
          }
        >
          {uploading ? (
            <div className="text-ink-soft text-sm">جارٍ الرفع...</div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center text-ink-soft">
                <Upload size={20} />
              </div>
              <div className="text-sm text-ink-soft">
                اسحب صورة هنا أو اضغط للاختيار
              </div>
              <div className="text-xs text-ink-muted">PNG, JPG حتى 5MB</div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPick}
          />
        </div>
      )}

      {error && (
        <div className="text-sm text-danger bg-danger/10 rounded-xl px-3 py-2">
          {error}
        </div>
      )}
    </div>
  );
}
