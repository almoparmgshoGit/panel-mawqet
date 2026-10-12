import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ItemForm } from "@/components/item-form";
import type { AdhkarItem } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string; itemId: string }>;
}

export default async function EditItemPage({ params }: PageProps) {
  const { id, itemId } = await params;
  const supabase = await createClient();

  const [catRes, itemRes] = await Promise.all([
    supabase.from("adhkar_categories").select("id, title_ar").eq("id", id).single(),
    supabase.from("adhkar_items").select("*").eq("id", itemId).single(),
  ]);

  if (catRes.error || !catRes.data || itemRes.error || !itemRes.data) {
    notFound();
  }

  return (
    <ItemForm
      categoryId={catRes.data.id}
      categoryTitle={catRes.data.title_ar}
      initial={itemRes.data as AdhkarItem}
    />
  );
}
