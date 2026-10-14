"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  HandHeart,
  BookHeart,
  Newspaper,
  HeartCrack,
  Flag,
  Sparkles,
  Settings,
  User,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  enabled: boolean;
}

const NAV: NavItem[] = [
  { href: "/dashboard", label: "الرئيسية", icon: LayoutDashboard, enabled: true },
  { href: "/donations", label: "التبرعات", icon: HandHeart, enabled: true },
  { href: "/adhkar", label: "الأذكار", icon: BookHeart, enabled: true },
  { href: "/collections", label: "الأقسام التعليمية", icon: Sparkles, enabled: true },
  { href: "/posts", label: "المنشورات", icon: Newspaper, enabled: true },
  { href: "/janazah", label: "الجنازات", icon: HeartCrack, enabled: true },
  { href: "/reports", label: "البلاغات", icon: Flag, enabled: true },
  { href: "/profile", label: "الملف الشخصي", icon: User, enabled: true },
  { href: "/settings", label: "الإعدادات", icon: Settings, enabled: true },
];

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  async function signOut() {
    localStorage.removeItem("admin_email");
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile Top Navbar (Visible only on mobile/tablet) */}
      <header className="md:hidden bg-white dark:bg-slate-900 border-b border-hairline dark:border-slate-800 sticky top-0 z-50 w-full transition-colors">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-cream font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #2D4A3E 0%, #1F352C 100%)" }}
            >
              م
            </div>
            <div>
              <div className="font-bold text-ink dark:text-white text-sm">مواقيت</div>
              <div className="text-[10px] text-ink-muted dark:text-slate-400">لوحة التحكم</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-ink-soft dark:text-slate-300 hover:bg-cream dark:hover:bg-slate-800 transition"
              title="تغيير المظهر"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-ink dark:text-white hover:bg-cream dark:hover:bg-slate-800 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="bg-white dark:bg-slate-900 border-b border-hairline dark:border-slate-800 p-3 shadow-lg animate-in slide-in-from-top">
            <nav className="space-y-1 mb-3">
              {NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;

                if (!item.enabled) {
                  return (
                    <div
                      key={item.href}
                      className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-ink-muted dark:text-slate-500 opacity-50 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] bg-cream-dark dark:bg-slate-800 px-1.5 py-0.5 rounded-full">قريباً</span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl transition text-sm",
                      active ? "bg-forest text-cream font-medium" : "text-ink-soft dark:text-slate-300 hover:bg-cream dark:hover:bg-slate-800"
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-hairline dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs text-ink-muted dark:text-slate-400 truncate px-2" dir="ltr">
                {userEmail}
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition"
              >
                <LogOut size={16} />
                <span>خروج</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Persistent Collapsible Sidebar */}
      <aside
        className={cn(
          "hidden md:flex bg-white dark:bg-slate-900 border-l border-hairline dark:border-slate-800 flex-col h-screen sticky top-0 transition-all duration-300 shrink-0",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-4 border-b border-hairline dark:border-slate-800 flex items-center justify-between">
          <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center w-full")}>
            <div
              className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-cream font-bold"
              style={{ background: "linear-gradient(135deg, #2D4A3E 0%, #1F352C 100%)" }}
            >
              م
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="font-bold text-ink dark:text-white">مواقيت</div>
                <div className="text-xs text-ink-muted dark:text-slate-400">لوحة التحكم</div>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-ink-soft dark:text-slate-300 hover:bg-cream dark:hover:bg-slate-800 transition shrink-0"
              title="طي القائمة"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {collapsed && (
          <div className="p-2 border-b border-hairline dark:border-slate-800 flex justify-center">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg text-ink-soft dark:text-slate-300 hover:bg-cream dark:hover:bg-slate-800 transition"
              title="توسيع القائمة"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

        <nav className="flex-1 p-3 overflow-y-auto space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            if (!item.enabled) {
              return (
                <div
                  key={item.href}
                  title={collapsed ? `${item.label} (قريباً)` : undefined}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-ink-muted dark:text-slate-500 cursor-not-allowed opacity-50 text-sm",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm",
                  collapsed && "justify-center px-2",
                  active
                    ? "bg-forest text-cream font-medium"
                    : "text-ink-soft dark:text-slate-300 hover:bg-cream dark:hover:bg-slate-800"
                )}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-hairline dark:border-slate-800 space-y-2">
          <button
            onClick={toggleTheme}
            title={collapsed ? (theme === "dark" ? "الوضع الفاتح" : "الوضع المظلم") : undefined}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-ink-soft dark:text-slate-300 hover:bg-cream dark:hover:bg-slate-800 transition",
              collapsed && "justify-center px-2"
            )}
          >
            {theme === "dark" ? <Sun size={18} className="shrink-0 text-amber-400" /> : <Moon size={18} className="shrink-0 text-slate-700" />}
            {!collapsed && <span className="truncate">{theme === "dark" ? "الوضع الفاتح" : "الوضع المظلم"}</span>}
          </button>

          {!collapsed && (
            <div className="px-4 py-1 truncate">
              <div className="text-xs text-ink-muted dark:text-slate-400">مسجل بـ</div>
              <div className="text-sm font-medium text-ink dark:text-slate-200 truncate" dir="ltr">
                {userEmail}
              </div>
            </div>
          )}

          <button
            onClick={signOut}
            title={collapsed ? "تسجيل الخروج" : undefined}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
