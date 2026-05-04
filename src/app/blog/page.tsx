'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import { SiteNavbar } from '@/components/ui/site-navbar';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  month: string | null;
  monthLabel: string | null;
  readingTime: string | null;
  publishedAt: string | null;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans flex flex-col">
      <SiteNavbar />
      <div className="container mx-auto max-w-4xl px-6 pt-28 pb-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#0B5D3F] font-bold mb-8 hover:underline"
        >
          <ArrowLeft size={20} />
          Vissza a főoldalra
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100">Rosti Blog</h1>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">Betöltés...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-300 dark:text-gray-600 mb-2">Hamarosan érkezik...</h2>
            <p className="text-gray-400 dark:text-gray-500">Még nincs bejegyzés.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                    {post.monthLabel && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#0B5D3F]" />
                        <span>2026. {post.monthLabel}</span>
                      </div>
                    )}
                    {post.readingTime && (
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#0B5D3F]" />
                        <span>{post.readingTime}</span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-[#0B5D3F] transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-6 flex items-center gap-2 text-[#0B5D3F] font-black text-sm uppercase tracking-widest">
                    <span>Olvasd el</span>
                    <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

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
    </div>
  );
}
