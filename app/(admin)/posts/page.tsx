import Link from "next/link";
import { Plus, Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { CommunityPost } from "@/lib/types";
import { PostsTable } from "./posts-table";

async function getPosts(): Promise<CommunityPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Posts fetch error:", error);
    return [];
  }

  return (data ?? []) as CommunityPost[];
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink">المنشورات</h1>
          <p className="text-ink-soft mt-1">
            الآيات والأحاديث والأدعية التي تظهر في صفحة المجتمع
          </p>
        </div>
        <Link
          href="/posts/new"
          className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition"
        >
          <Plus size={18} />
          منشور جديد
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-hairline p-12 text-center">
          <Newspaper size={32} className="mx-auto text-ink-muted mb-3" />
          <div className="text-ink-soft mb-4">لا توجد منشورات بعد</div>
          <Link
            href="/posts/new"
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-cream font-medium rounded-xl px-5 py-2.5 transition"
          >
            <Plus size={18} />
            أضف أول منشور
          </Link>
        </div>
      ) : (
        <PostsTable posts={posts} />
      )}
    </div>
  );
}
