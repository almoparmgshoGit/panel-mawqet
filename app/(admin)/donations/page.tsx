import Link from "next/link";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import type { Donation } from "@/lib/types";
import { DonationsTable } from "./donations-table";

async function getDonations(): Promise<Donation[]> {
  try {
    return await api.getDonations();
  } catch (error) {
    console.error("Donations fetch error:", error);
    return [];
  }
}

export default async function DonationsPage() {
  const donations = await getDonations();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink">التبرعات</h1>
          <p className="text-ink-soft mt-1">
            تظهر هذه البطاقات في الصفحة الرئيسية للتطبيق
          </p>
        </div>
        <Link
          href="/donations/new"
          className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition"
        >
          <Plus size={18} />
          إضافة تبرع
        </Link>
      </div>

      {donations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-hairline p-12 text-center">
          <div className="text-ink-soft mb-4">لا توجد تبرعات بعد</div>
          <Link
            href="/donations/new"
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition"
          >
            <Plus size={18} />
            أضف أول تبرع
          </Link>
        </div>
      ) : (
        <DonationsTable donations={donations} />
      )}
    </div>
  );
}
