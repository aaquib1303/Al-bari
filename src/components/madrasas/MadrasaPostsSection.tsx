"use client";

import * as React from "react";
import {
  FileText,
  BookOpen,
  Camera,
  GraduationCap,
  Award,
  MessageSquare,
} from "lucide-react";
import { PostCard } from "@/components/dashboard/PostCard";
import { Post } from "@/types/database";

interface MadrasaPostsSectionProps {
  posts: Post[];
  madrasaName: string;
}

export function MadrasaPostsSection({ posts, madrasaName }: MadrasaPostsSectionProps) {
  const [activeTab, setActiveTab] = React.useState<string>("all");

  const categories = React.useMemo(() => {
    const counts: Record<string, number> = {
      all: posts.length,
      activity: 0,
      tests: 0,
      results: 0,
      resources: 0,
      other: 0,
    };

    posts.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      } else {
        counts.other = (counts.other || 0) + 1;
      }
    });

    return [
      { id: "all", label: "All Records", count: counts.all, icon: BookOpen },
      { id: "resources", label: "Faculty & Student Feedbacks", count: counts.resources, icon: MessageSquare },
      { id: "activity", label: "Activities & Photos", count: counts.activity, icon: Camera },
      { id: "tests", label: "Tests & Question Papers", count: counts.tests, icon: GraduationCap },
      { id: "results", label: "Performance & Outcomes", count: counts.results, icon: Award },
    ];
  }, [posts]);

  const filteredPosts = React.useMemo(() => {
    return posts.filter((p) => activeTab === "all" || p.category === activeTab);
  }, [posts, activeTab]);

  return (
    <div className="space-y-6">
      {/* Category Tabs Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs ${isActive
                  ? "bg-primary-700 text-white shadow-sm border border-primary-800"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-primary-600"}`} />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-primary-900 text-primary-200" : "bg-slate-100 text-slate-600"
                  }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 shadow-2xs space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <p className="font-bold text-slate-800 text-base">No records found</p>
            <p className="text-xs text-slate-500 mt-0.5">
              No posts match the selected category for this campus.
            </p>
          </div>
          {activeTab !== "all" && (
            <button
              onClick={() => setActiveTab("all")}
              className="px-3 py-1.5 text-xs font-bold text-primary-700 hover:underline"
            >
              View all records
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
