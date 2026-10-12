import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoryForm } from "@/components/category-form";
import type { AdhkarCategory } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("adhkar_categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return <CategoryForm initial={data as AdhkarCategory} />;
}
