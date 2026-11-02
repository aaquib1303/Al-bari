"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-primary-950 text-white border-t-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          {/* Brand Info */}
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-900 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                ب
              </div>
              <span className="font-bold text-lg text-white tracking-wide">
                Al Bari
              </span>
            </div>
            <p className="text-primary-200/80 text-xs leading-relaxed">
              {t.tagline}. Centralizing curriculum preservation, examination archives, and madrasa operational records.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300/90">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Google Drive Storage & Row-Level Authorization</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-primary-100/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t.nav.overview}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Explore Records
                </Link>
              </li>
              <li>
                <Link href="/madrasas" className="hover:text-white transition-colors">
                  {t.nav.madrasas}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  {t.nav.login}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-primary-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-300/70">
          <p>© {new Date().getFullYear()} Al Bari Organization. All rights reserved.</p>
          <span>English • हिन्दी • اردو</span>
        </div>
      </div>
    </footer>
  );
}
