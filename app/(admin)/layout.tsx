import { Sidebar } from "@/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userEmail = "admin@mawaqit.local";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF8F5] dark:bg-slate-950 text-ink dark:text-slate-100 transition-colors">
      <Sidebar userEmail={userEmail} />
      <main className="flex-1 overflow-x-hidden w-full">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
