'use client';

import Link from 'next/link';
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
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <SiteNavbar />
      <div className="container mx-auto max-w-4xl px-6 pt-28 pb-12">
        <Link
          href="/blog"
          className="flex items-center gap-2 text-[#0B5D3F] font-bold mb-8 hover:underline"
        >
          <ArrowLeft size={20} />
          Vissza a blogra
        </Link>

        <article className="prose prose-lg max-w-none">
          <header className="mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500 uppercase tracking-wide">
              {post.monthLabel && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#0B5D3F]" />
                  <span>2026. {post.monthLabel}</span>
                </div>
              )}
              {post.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#0B5D3F]" />
                  <span>{post.readingTime}</span>
                </div>
              )}
              {post.authorName && (
                <div className="text-gray-400">
                  Írta: {post.authorName}
                </div>
              )}
            </div>
          </header>

          <div
            className="space-y-6 leading-relaxed text-gray-700 text-lg blog-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          {/* CTA */}
          <div className="mt-16 flex flex-col items-center">
            <Link
              href="/modern-shop"
              className="group flex items-center gap-4 cursor-pointer select-none"
            >
              <span className="bg-[#0B5D3F] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-black shadow-xl transition-all transform group-hover:bg-[#147A55] group-hover:shadow-2xl group-hover:scale-105 flex items-center gap-3">
                <span>Feltöltöm a hűtőt</span>
                <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.imgur.com/h8taJcy.png"
                alt="Friss zöldségek"
                className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 drop-shadow-md group-hover:scale-110 group-hover:-rotate-3"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </Link>
          </div>
        </article>
      </div>

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
      `}</style>
    </div>
  );
}
