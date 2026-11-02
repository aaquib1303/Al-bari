import Link from "next/link";
import { Building2, Users } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Madrasa } from "@/types/database";
import { mergeWithKnownMadrasas } from "@/lib/madrasas";

export const revalidate = 60;

async function getHomeData() {
  const adminClient = createAdminClient();

  let dbMadrasas: Madrasa[] = [];
  let teachersCount = 0;

  try {
    const [{ count: tCount }, { data: mData }] = await Promise.all([
      adminClient
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "teacher")
        .eq("active", true),
      adminClient
        .from("madrasas")
        .select("id, name, city, contact_person, active")
        .eq("active", true)
        .order("name", { ascending: true }),
    ]);

    teachersCount = tCount || 0;
    dbMadrasas = (mData || []) as Madrasa[];
  } catch (err) {
    console.error("Error fetching landing data:", err);
  }

  const madrasas = mergeWithKnownMadrasas(dbMadrasas);

  return {
    madrasasCount: madrasas.length,
    teachersCount: teachersCount || 2, // 2 educators registered default
    madrasas,
  };
}

export default async function HomePage() {
  const { madrasasCount, teachersCount, madrasas } = await getHomeData();

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 gap-5 sm:gap-7 max-w-xl mx-auto my-auto">
      {/* ── MADRASAS SECTION ── */}
      <section>
        <h2 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2.5 px-0.5">
          Madrasas
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {madrasas.map((madrasa) => (
            <Link
              key={madrasa.id}
              href={`/madrasas?selected=${madrasa.id}`}
              className="group flex flex-col items-center justify-center gap-2 sm:gap-2.5 rounded-2xl border border-slate-200 bg-white hover:border-primary-300 hover:shadow-md transition-all p-3.5 sm:p-5 text-center shadow-2xs active:scale-[0.98]"
            >
              {/* Icon container */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug group-hover:text-primary-800 transition-colors line-clamp-2">
                  {madrasa.name}
                </p>
                {madrasa.city && (
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 font-medium">
                    {madrasa.city}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── OVERVIEW STATS SECTION ── */}
      <section>
        <h2 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2.5 px-0.5">
          Overview
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Active Madrasas */}
          <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 text-center shadow-2xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-primary-700 leading-none mt-0.5">
              {madrasasCount}
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Active Madrasas
            </p>
          </div>

          {/* Active Educators */}
          <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 text-center shadow-2xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 leading-none mt-0.5">
              {teachersCount}
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Active Educators
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
