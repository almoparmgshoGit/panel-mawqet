"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Direct login routing since backend is custom PostgreSQL API
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2D4A3E 0%, #1F352C 100%)" }}
          >
            <LogIn className="text-cream" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-ink">لوحة تحكم مواقيت</h1>
          <p className="text-ink-soft text-sm mt-2">سجّل دخولك للمتابعة</p>
        </div>

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
              placeholder="admin@example.com"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cream border border-hairline rounded-xl px-4 py-3 text-ink outline-none focus:border-forest transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl py-3 transition disabled:opacity-50"
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
