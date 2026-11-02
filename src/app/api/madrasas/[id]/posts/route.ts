import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminClient = createAdminClient();

    const { data: posts, error } = await adminClient
      .from("posts")
      .select(`
        id, title, description, category, event_date, status, approval_status, visibility, created_at,
        madrasa:madrasas(*),
        teacher:profiles!posts_teacher_id_fkey(id, full_name, username),
        files:post_files(*)
      `)
      .eq("madrasa_id", params.id)
      .eq("approval_status", "approved")
      .eq("visibility", "public")
      .is("deleted_at", null)
      .order("event_date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: posts || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

