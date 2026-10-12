import { HandHeart, Newspaper, HeartCrack, Flag } from "lucide-react";
import { api } from "@/lib/api";
import { toArabicDigits } from "@/lib/utils";

interface Stat {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
}

async function getCounts() {
  try {
    const [donations, posts, janazah, feedback] = await Promise.all([
      api.getDonations().catch(() => []),
      api.getPosts().catch(() => []),
      api.getJanazahs().catch(() => []),
      api.getFeedback().catch(() => []),
    ]);

    return {
      donations: Array.isArray(donations) ? donations.filter((d: any) => d.is_active).length : 0,
      posts: Array.isArray(posts) ? posts.length : 0,
      janazah: Array.isArray(janazah) ? janazah.length : 0,
      reports: Array.isArray(feedback) ? feedback.length : 0,
    };
  } catch {
    return { donations: 0, posts: 0, janazah: 0, reports: 0 };
  }
}

export default async function DashboardPage() {
  const counts = await getCounts();

  const stats: Stat[] = [
    {
      label: "تبرعات نشطة",
      value: counts.donations,
      icon: HandHeart,
      accent: "linear-gradient(135deg, #2D4A3E 0%, #1F352C 100%)",
    },
    {
      label: "منشورات",
      value: counts.posts,
      icon: Newspaper,
      accent: "linear-gradient(135deg, #C9A661 0%, #8B6F47 100%)",
    },
    {
      label: "جنازات",
      value: counts.janazah,
      icon: HeartCrack,
      accent: "linear-gradient(135deg, #5C413B 0%, #3E2D2A 100%)",
    },
    {
      label: "بلاغات",
      value: counts.reports,
      icon: Flag,
      accent: "linear-gradient(135deg, #B5453E 0%, #8C342F 100%)",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink">الرئيسية</h1>
        <p className="text-ink-soft mt-1">نظرة عامة على محتوى التطبيق</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-3xl border border-hairline p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-cream"
                  style={{ background: s.accent }}
                >
                  <Icon size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold text-ink">
                {toArabicDigits(s.value)}
              </div>
              <div className="text-sm text-ink-soft mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-white rounded-3xl border border-hairline p-8">
        <h2 className="text-lg font-bold text-ink mb-2">مرحباً 👋</h2>
        <p className="text-ink-soft text-sm leading-relaxed">
          من هنا تتحكم بكل المحتوى المعروض داخل تطبيق مواقيت — التبرعات، الأذكار،
          المنشورات، والجنازات. أي تعديل تسويه ينعكس مباشرة على المستخدمين بعد دقائق.
        </p>
      </div>
    </div>
  );
}
