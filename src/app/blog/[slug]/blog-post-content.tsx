'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import { SiteNavbar } from '@/components/ui/site-navbar';
import DOMPurify from 'isomorphic-dompurify';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  month: string | null;
  monthLabel: string | null;
  readingTime: string | null;
  publishedAt: Date | null;
  authorName: string | null;
}

export function BlogPostContent({ post }: { post: BlogPost }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans flex flex-col">
      <SiteNavbar />
      <div className="container mx-auto max-w-4xl px-6 pt-28 pb-12">
        <Link
          href="/blog"
          className="flex items-center gap-2 text-[#0B5D3F] dark:text-emerald-400 font-bold mb-8 hover:underline"
        >
          <ArrowLeft size={20} />
          Vissza a blogra
        </Link>

        <article className="prose prose-lg max-w-none">
          <header className="mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {post.monthLabel && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#0B5D3F] dark:text-emerald-400" />
                  <span>2026. {post.monthLabel}</span>
                </div>
              )}
              {post.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#0B5D3F] dark:text-emerald-400" />
                  <span>{post.readingTime}</span>
                </div>
              )}
              {post.authorName && (
                <div className="text-gray-400 dark:text-gray-500">
                  Írta: {post.authorName}
                </div>
              )}
            </div>
          </header>

          <div
            className="space-y-6 leading-relaxed text-gray-700 dark:text-gray-300 text-lg blog-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          {/* CTA */}
          <div className="mt-16 flex flex-col items-center text-center">
            <Link
              href="/modern-shop"
              className="group flex flex-col sm:flex-row items-center gap-4"
            >
              <button className="flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg group-hover:bg-[#147A55] group-hover:shadow-[#0B5D3F]/20 group-hover:scale-105">
                <span>FELTÖLTÖM A HŰTŐT</span>
                <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://cdn.jsdelivr.net/gh/bal1nt/rosti-img@main/ROSTI_WEBSHOP_P_tr.png"
                alt="Friss zöldségek"
                className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 drop-shadow-sm group-hover:scale-110 group-hover:-rotate-3"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </Link>
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 px-6 mt-auto relative">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 relative">
          <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <Image
              src="/images/logo.png"
              alt="Rosti"
              width={96}
              height={24}
              className="h-6 w-auto object-contain"
            />
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
              <Link href="/gyik" className="hover:text-[#0B5D3F] transition-colors">GYIK</Link>
              <Link href="/blog" className="hover:text-[#0B5D3F] transition-colors">Blog</Link>
              <Link href="/osszetevok" className="hover:text-[#0B5D3F] transition-colors">Összetevők</Link>
              <Link href="/adatkezeles" className="hover:text-[#0B5D3F] transition-colors">Adatkezelés</Link>
              <Link href="/altalanos-szerzodesi-feltetelek" className="hover:text-[#0B5D3F] transition-colors">ÁSZF</Link>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium text-center md:text-right leading-relaxed">
              © 2026 Rosti. Minden jog fenntartva.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .blog-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
          margin-top: 2.5rem;
        }
        .blog-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.75rem;
          margin-top: 2rem;
        }
        .blog-content p {
          margin-bottom: 1rem;
        }
        .blog-content ul, .blog-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .blog-content ul {
          list-style-type: disc;
        }
        .blog-content ol {
          list-style-type: decimal;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        .blog-content li::marker {
          color: #0B5D3F;
        }
        .blog-content blockquote {
          border-left: 4px solid #0B5D3F;
          padding-left: 1rem;
          font-style: italic;
          color: #4B5563;
          margin: 1.5rem 0;
        }
        .blog-content a {
          color: #0B5D3F;
          text-decoration: underline;
        }
        .blog-content a:hover {
          text-decoration: none;
        }
        .blog-content .conclusion {
          background-color: #F9FAFB;
          padding: 2rem;
          border-radius: 1.5rem;
          border: 1px solid #F3F4F6;
          margin-top: 3rem;
        }
        .blog-content .conclusion h2 {
          text-transform: uppercase;
          letter-spacing: -0.025em;
          font-weight: 900;
        }
        .blog-content sup {
          font-style: normal;
        }

        /* Dark mode overrides for blog content */
        /* Force override inline Tailwind classes (e.g. text-gray-900) from DB-stored HTML */
        .dark .blog-content,
        .dark .blog-content p,
        .dark .blog-content li,
        .dark .blog-content span,
        .dark .blog-content div {
          color: #D1D5DB !important;
        }
        .dark .blog-content h2,
        .dark .blog-content h3 {
          color: #F3F4F6 !important;
        }
        .dark .blog-content .font-medium,
        .dark .blog-content [class*="text-gray-9"],
        .dark .blog-content [class*="text-gray-8"],
        .dark .blog-content [class*="text-gray-7"] {
          color: #D1D5DB !important;
        }
        .dark .blog-content blockquote,
        .dark .blog-content blockquote * {
          color: #9CA3AF !important;
        }
        .dark .blog-content a {
          color: #34D399 !important;
        }
        .dark .blog-content .conclusion {
          background-color: #1F2937 !important;
          border-color: #374151 !important;
        }
        .dark .blog-content li::marker {
          color: #34D399;
        }
        .dark .blog-content strong {
          color: #F3F4F6 !important;
        }
      `}</style>
    </div>
  );
}
