import { createAdminClient } from "@/lib/supabase/admin";
import { MadrasaSplitView } from "@/components/madrasas/MadrasaSplitView";
import { Post } from "@/types/database";
import { mergeWithKnownMadrasas } from "@/lib/madrasas";

export const revalidate = 60;

async function getMadrasasWithInitialPosts(selectedId?: string) {
  const adminClient = createAdminClient();

  let dbMadrasas: any[] = [];
  try {
    const { data } = await adminClient
      .from("madrasas")
      .select(`
        id, name, city, contact_person, active, created_at,
        posts:posts(id)
      `)
      .eq("active", true)
      .order("name", { ascending: true });

    dbMadrasas = data || [];
  } catch (err) {
    console.error("Error loading madrasas:", err);
  }

  const list = mergeWithKnownMadrasas(dbMadrasas);

  if (list.length === 0) return { madrasas: [], initialSelectedId: "", initialPosts: [] };

  // Use query-param selected ID if valid, otherwise default to first
  const firstId =
    selectedId && list.find((m: any) => m.id === selectedId)
      ? selectedId
      : list[0].id;

  let posts: any[] = [];
  try {
    const { data: postsData } = await adminClient
      .from("posts")
      .select(`
        id, title, description, category, event_date, status, approval_status, visibility, created_at,
        madrasa:madrasas(*),
        teacher:profiles!posts_teacher_id_fkey(id, full_name, username),
        files:post_files(*)
      `)
      .eq("madrasa_id", firstId)
      .eq("approval_status", "approved")
      .eq("visibility", "public")
      .is("deleted_at", null)
      .order("event_date", { ascending: false });

    posts = postsData || [];
  } catch (err) {
    console.error("Error loading posts for madrasa:", err);
  }

  return {
    madrasas: list,
    initialSelectedId: firstId,
    initialPosts: posts as unknown as Post[],
  };
}

export default async function MadrasasDirectoryPage({
  searchParams,
}: {
  searchParams: { selected?: string };
}) {
  const { madrasas, initialSelectedId, initialPosts } =
    await getMadrasasWithInitialPosts(searchParams.selected);

  if (madrasas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 text-center p-8">
        <p className="text-lg font-bold text-slate-700">No madrasas found</p>
        <p className="text-sm mt-1">Please check back later.</p>
      </div>
    );
  }

  return (
    <MadrasaSplitView
      madrasas={madrasas}
      initialSelectedId={initialSelectedId}
      initialPosts={initialPosts}
    />
  );
}
