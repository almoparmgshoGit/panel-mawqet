import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CollectionItemForm } from "@/components/collection-item-form";
import type { KnowledgeCollection, KnowledgeItem } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string; itemId: string }>;
}

export default async function EditItemPage({ params }: PageProps) {
  const { id, itemId } = await params;
  const supabase = await createClient();

  const [colRes, itemRes] = await Promise.all([
    supabase.from("knowledge_collections").select("*").eq("id", id).single(),
    supabase.from("knowledge_items").select("*").eq("id", itemId).single(),
  ]);

  if (colRes.error || !colRes.data || itemRes.error || !itemRes.data) {
    notFound();
  }

  return (
    <CollectionItemForm
      collection={colRes.data as KnowledgeCollection}
      initial={itemRes.data as KnowledgeItem}
    />
  );
}
