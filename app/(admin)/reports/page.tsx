import { Flag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { UserFeedback } from "@/lib/types";
import { ReportsTable } from "./reports-table";

async function getFeedback(): Promise<UserFeedback[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_feedback")
    .select("*")
    .order("resolved", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("Feedback fetch error:", error);
    return [];
  }

  return (data ?? []) as UserFeedback[];
}

export default async function ReportsPage() {
  const items = await getFeedback();
  const unresolvedCount = items.filter((i) => !i.resolved).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink">البلاغات</h1>
        <p className="text-ink-soft mt-1">
          الرسائل التي يرسلها المستخدمون من داخل التطبيق
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-hairline p-12 text-center">
          <Flag size={32} className="mx-auto text-ink-muted mb-3" />
          <div className="text-ink-soft">لا توجد بلاغات حتى الآن</div>
          <div className="text-xs text-ink-muted mt-2">
            ستظهر هنا أي رسالة يرسلها المستخدمون من شاشة الإعدادات في التطبيق
          </div>
        </div>
      ) : (
        <ReportsTable items={items} unresolvedCount={unresolvedCount} />
      )}
    </div>
  );
}
