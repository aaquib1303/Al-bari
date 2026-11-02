import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { MadrasaPostsSection } from "@/components/madrasas/MadrasaPostsSection";
import { Post } from "@/types/database";
import { KNOWN_MADRASAS } from "@/lib/madrasas";

export const revalidate = 60;

async function getMadrasaDetails(id: string) {
  const adminClient = createAdminClient();

  let madrasa: any = null;
  let posts: any[] = [];

  try {
    const { data } = await adminClient
      .from("madrasas")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    madrasa = data;
  } catch (err) {
    console.error("Error fetching madrasa by id:", err);
  }

  // Fallback to known static madrasas if not in DB yet
  if (!madrasa) {
    madrasa = KNOWN_MADRASAS.find((m) => m.id === id) || null;
  }

  if (!madrasa) return null;

  try {
    const { data: postsData } = await adminClient
      .from("posts")
      .select(`
        id, title, description, category, event_date, status, approval_status, visibility, created_at,
        madrasa:madrasas(*),
        teacher:profiles!posts_teacher_id_fkey(id, full_name, username),
        files:post_files(*)
      `)
      .eq("madrasa_id", id)
      .eq("approval_status", "approved")
      .eq("visibility", "public")
      .is("deleted_at", null)
      .order("event_date", { ascending: false });

    posts = postsData || [];
  } catch (err) {
    console.error("Error fetching posts for madrasa:", err);
  }

  return {
    madrasa,
    posts: posts as unknown as Post[],
  };
}

export default async function MadrasaDetailPage({ params }: { params: { id: string } }) {
  const data = await getMadrasaDetails(params.id);
  if (!data) notFound();

  const { madrasa, posts } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <Link
        href="/madrasas"
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Madrasas</span>
      </Link>

      {/* Educational Archives & Category Posts Section */}
      <MadrasaPostsSection posts={posts} madrasaName={madrasa.name} />
    </div>
  );
}
