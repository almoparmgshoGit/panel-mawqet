import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CollectionForm } from "@/components/collection-form";
import type { KnowledgeCollection } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCollectionPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge_collections")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return <CollectionForm initial={data as KnowledgeCollection} />;
}
