"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.login({ email, password });
      if (res.success) {
        localStorage.setItem("admin_email", res.email || email);
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("بيانات الدخول غير صحيحة");
      }
    } catch (e: any) {
      setError(e.message || "حدث خطأ أثناء تسجيل الدخول. تأكد من صحة البريد وكلمة المرور.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-md"
            style={{ background: "linear-gradient(135deg, #2D4A3E 0%, #1F352C 100%)" }}
          >
            <LogIn className="text-cream" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-ink">لوحة تحكم مواقيت</h1>
          <p className="text-ink-soft text-sm mt-2">سجّل دخولك للمتابعة للوصول إلى لوحة الإدارة</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl px-4 py-3 bg-danger/10 border border-danger/20 text-danger flex items-center gap-3 text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-3xl border border-hairline p-6 shadow-sm space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-soft block">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className="w-full bg-cream border border-hairline rounded-xl px-4 py-3 text-ink outline-none focus:border-forest transition"
              placeholder="admin@mawaqit.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-soft block">
              كلمة السر
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value= {password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cream border border-hairline rounded-xl px-4 py-3 text-ink outline-none focus:border-forest transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl py-3 transition disabled:opacity-50 shadow-sm"
          >
            {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="text-center text-xs text-ink-muted mt-6">
          مواقيت — لوحة تحكم المشرف
        </p>
      </div>
    </div>
  );
}
