import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DonationForm } from "@/components/donation-form";
import type { Donation } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDonationPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return <DonationForm initial={data as Donation} />;
}
