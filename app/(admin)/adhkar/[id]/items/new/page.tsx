import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ItemForm } from "@/components/item-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewItemPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("adhkar_categories")
    .select("id, title_ar")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return <ItemForm categoryId={data.id} categoryTitle={data.title_ar} />;
}
