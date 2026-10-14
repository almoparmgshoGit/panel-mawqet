"use client";

import { useState, useEffect } from "react";
import { KeyRound, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const [currentEmail, setCurrentEmail] = useState("admin@mawaqit.com");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingCreds, setUpdatingCreds] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin_email");
    if (stored) {
      setCurrentEmail(stored);
      setNewEmail(stored);
    }
  }, []);

  async function handleUpdateCredentials(e: React.FormEvent) {
    e.preventDefault();
    setUpdatingCreds(true);
    setMessage(null);

    try {
      const res = await api.updateCredentials({
        email: currentEmail,
        currentPassword,
        newEmail: newEmail !== currentEmail ? newEmail : undefined,
        newPassword: newPassword ? newPassword : undefined,
      });

      if (res.success) {
        if (res.email) {
          setCurrentEmail(res.email);
          localStorage.setItem("admin_email", res.email);
        }
        setCurrentPassword("");
        setNewPassword("");
        setMessage({ type: "success", text: "تم تحديث بيانات الحساب وكلمة المرور بنجاح" });
      }
    } catch (e: any) {
      setMessage({ type: "error", text: "فشل التحديث: " + (e.message || e) });
    } finally {
      setUpdatingCreds(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink">الملف الشخصي</h1>
        <p className="text-ink-soft mt-1">إدارة بيانات حساب المشرف وكلمة المرور</p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-2xl px-4 py-3 flex items-center gap-3 ${
            message.type === "success"
              ? "bg-success/10 border border-success/20 text-success"
              : "bg-danger/10 border border-danger/20 text-danger"
          }`}
        >
          {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-hairline overflow-hidden max-w-2xl">
        <div className="p-6 border-b border-hairline flex items-center gap-3">
          <KeyRound className="text-forest" size={24} />
          <div>
            <h2 className="text-xl font-bold text-ink">بيانات الدخول وحماية الحساب</h2>
            <p className="text-ink-soft mt-0.5 text-sm">
              تغيير البريد الإلكتروني أو كلمة المرور الخاصة بلوحة التحكم
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateCredentials} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-soft block">
              البريد الإلكتروني الحالي / الجديد
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-ink-muted">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                dir="ltr"
                className="w-full bg-cream border border-hairline rounded-xl pr-10 pl-4 py-3 text-ink outline-none focus:border-forest transition text-left"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-soft block">
              كلمة المرور الحالية (طلباً للتحقق)
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-cream border border-hairline rounded-xl px-4 py-3 text-ink outline-none focus:border-forest transition"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-soft block">
              كلمة المرور الجديدة (اختياري)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-cream border border-hairline rounded-xl px-4 py-3 text-ink outline-none focus:border-forest transition"
              placeholder="اتركها فارغة إن لم ترغب بتغييرها"
            />
          </div>

          <button
            type="submit"
            disabled={updatingCreds}
            className="bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-6 py-3 transition disabled:opacity-50 text-sm shadow-sm"
          >
            {updatingCreds ? "جارٍ الحفظ..." : "حفظ التغييرات"}
          </button>
        </form>
      </div>
    </div>
  );
}
