"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { AdminAuthGuard } from "./auth-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userEmail, setUserEmail] = useState("admin@mawaqit.local");

  useEffect(() => {
    const email = localStorage.getItem("admin_email");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  return (
    <AdminAuthGuard>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF8F5] dark:bg-slate-950 text-ink dark:text-slate-100 transition-colors">
        <Sidebar userEmail={userEmail} />
        <main className="flex-1 overflow-x-hidden w-full">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}
