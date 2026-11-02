"use client";

import * as React from "react";
import { Building2, FileText, BookOpen, Camera, GraduationCap, Award, MessageSquare } from "lucide-react";
import { PostCard } from "@/components/dashboard/PostCard";
import { Post } from "@/types/database";

interface Madrasa {
  id: string;
  name: string;
  city?: string | null;
  contact_person?: string | null;
  posts?: { id: string }[];
}

interface MadrasaSplitViewProps {
  madrasas: Madrasa[];
  initialSelectedId: string;
  initialPosts: Post[];
}

// Derive a clean, concise short display name for the top/sidebar box
function getShortName(fullName: string): string {
  const lower = fullName.toLowerCase();
  if (lower.includes("alamgir")) return "Alamgir";
  if (lower.includes("nizamiya")) return "Nizamiya";
  if (lower.includes("ansar")) return "Ansar";
  if (lower.includes("baqiyatus")) return "Baqiyatus";
  const words = fullName.trim().split(/\s+/);
  return words[0].slice(0, 10);
}

// Palette of distinct blues, indigos, cyan & violets (no green)
const SIDEBAR_COLORS = [
  { bg: "bg-sky-600",    activeBg: "bg-sky-500",    text: "text-white" },
  { bg: "bg-indigo-600", activeBg: "bg-indigo-500", text: "text-white" },
  { bg: "bg-blue-600",   activeBg: "bg-blue-500",   text: "text-white" },
  { bg: "bg-slate-700",  activeBg: "bg-slate-600",  text: "text-white" },
  { bg: "bg-cyan-600",   activeBg: "bg-cyan-500",   text: "text-white" },
  { bg: "bg-violet-600", activeBg: "bg-violet-500", text: "text-white" },
];

const CATEGORY_TABS = [
  { id: "all",       label: "All",       icon: BookOpen },
  { id: "resources", label: "Feedbacks", icon: MessageSquare },
  { id: "activity",  label: "Activities",icon: Camera },
  { id: "tests",     label: "Tests",     icon: GraduationCap },
  { id: "results",   label: "Results",   icon: Award },
];

export function MadrasaSplitView({
  madrasas,
  initialSelectedId,
  initialPosts,
}: MadrasaSplitViewProps) {
  const [selectedId, setSelectedId] = React.useState<string>(initialSelectedId);
  const [posts, setPosts] = React.useState<Post[]>(initialPosts);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("all");

  const selectedMadrasa = madrasas.find((m) => m.id === selectedId);

  // Fetch posts when a new madrasa is selected
  const handleSelect = React.useCallback(
    async (id: string) => {
      if (id === selectedId) return;
      setSelectedId(id);
      setActiveTab("all");
      setLoading(true);
      try {
        const res = await fetch(`/api/madrasas/${id}/posts`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        } else {
          setPosts([]);
        }
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    },
    [selectedId]
  );

  // Filtered posts by category
  const filteredPosts = React.useMemo(() => {
    if (activeTab === "all") return posts;
    return posts.filter((p) => p.category === activeTab);
  }, [posts, activeTab]);

  // Count per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: posts.length };
    posts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [posts]);

  return (
    /* 
      Full-height split layout below the navbar.
      On mobile: stacked (top header grid with 4 boxes filling the entire width, content below).
      On sm+: side-by-side (narrow sidebar left, scrollable content right).
    */
    <div className="flex flex-col sm:flex-row w-full" style={{ minHeight: "calc(100vh - 64px)" }}>

      {/* ── TOP BAR (MOBILE) / LEFT SIDEBAR (DESKTOP) ── */}
      <aside
        className={[
          // Mobile: grid dividing the full width equally among the madrasas (4 boxes fill 100% space)
          "w-full grid sm:flex sm:flex-col sm:w-20 lg:w-24",
          // sm+: vertical column, fixed width, scrollable
          "sm:overflow-y-auto sm:overflow-x-hidden",
          // Styling
          "bg-slate-900 shrink-0",
          "scrollbar-none",
        ].join(" ")}
        style={{
          gridTemplateColumns: `repeat(${madrasas.length}, minmax(0, 1fr))`,
        }}
        aria-label="Madrasa selection"
      >
        {madrasas.map((madrasa, idx) => {
          const isActive = madrasa.id === selectedId;
          const color = SIDEBAR_COLORS[idx % SIDEBAR_COLORS.length];
          const shortName = getShortName(madrasa.name);

          return (
            <button
              key={madrasa.id}
              onClick={() => handleSelect(madrasa.id)}
              title={madrasa.name}
              className={[
                // Layout: column flex for icon + name
                "flex flex-col items-center justify-center gap-1",
                // Mobile: fills its grid cell completely, height 74px. sm+: full-width column item, height 80-96px
                "w-full h-[74px] sm:h-20 lg:h-24",
                // Touch target & transitions
                "transition-all duration-200 relative select-none",
                // Active indicators: bottom border on mobile, left border on desktop
                isActive
                  ? "border-b-4 border-amber-400 sm:border-b-0 sm:border-l-4"
                  : "border-b-4 border-transparent sm:border-b-0 sm:border-l-4",
                // Background
                isActive ? color.activeBg : color.bg,
                // Hover
                "hover:brightness-110 active:brightness-95",
              ].join(" ")}
              aria-pressed={isActive}
              aria-label={`Select ${madrasa.name}`}
            >
              {isActive ? (
                /* Active: show mosque icon */
                <Building2 className="w-5 h-5 sm:w-7 sm:h-7 text-amber-300 shrink-0" />
              ) : (
                /* Inactive: show index number */
                <span className="text-base sm:text-xl font-black text-white/90 leading-none">
                  {idx + 1}
                </span>
              )}
              <span
                className={[
                  "text-[9px] sm:text-[10px] font-bold leading-tight text-center px-1 truncate max-w-full",
                  isActive ? "text-amber-200" : "text-white/85",
                ].join(" ")}
              >
                {shortName}
              </span>
            </button>
          );
        })}
      </aside>

      {/* ── RIGHT CONTENT PANEL ── */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50">

        {/* Category tab ribbon — sticky within the content panel */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-3 sm:px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none shadow-2xs">
          {CATEGORY_TABS.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={[
                  "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  isActive
                    ? "bg-primary-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                ].join(" ")}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : "text-primary-600"}`} />
                <span>{cat.label}</span>
                <span
                  className={[
                    "text-[10px] px-1.5 py-0.5 rounded-full",
                    isActive ? "bg-primary-900 text-primary-200" : "bg-white text-slate-500",
                  ].join(" ")}
                >
                  {cat.id === "all" ? posts.length : (categoryCounts[cat.id] ?? 0)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Posts content area */}
        <div className="p-3 sm:p-4 lg:p-6">
          {loading ? (
            /* Loading skeleton */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 h-64 animate-pulse"
                />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            /* Empty state (blank records) */
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 space-y-3">
              <FileText className="w-14 h-14 text-slate-300" />
              <div>
                <p className="font-bold text-slate-700 text-base">No records found</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {activeTab === "all"
                    ? `No public posts available for ${selectedMadrasa?.name ?? "this madrasa"} yet.`
                    : "No posts match the selected category."}
                </p>
              </div>
              {activeTab !== "all" && (
                <button
                  onClick={() => setActiveTab("all")}
                  className="text-xs font-bold text-primary-700 hover:underline"
                >
                  View all records
                </button>
              )}
            </div>
          ) : (
            /* Post grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
