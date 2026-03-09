'use client';

import Link from 'next/link';
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

const MONTHS = [
  { key: 'jan', label: 'Január' },
  { key: 'feb', label: 'Február' },
  { key: 'mar', label: 'Március' },
  { key: 'apr', label: 'Április' },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
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

  const filteredPosts = selectedMonth
    ? posts.filter(p => p.month === selectedMonth)
    : posts;

  // Find which months have posts
  const monthsWithPosts = new Set(posts.map(p => p.month).filter(Boolean));

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Rosti Blog</h1>
          <p className="text-lg text-gray-500 font-medium">
            Tudományos háttér, tippek és érdekességek az egészséges irodai élethez.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex gap-2 mb-12 overflow-x-auto no-scrollbar pb-2 items-center">
          <button
            onClick={() => setSelectedMonth(null)}
            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap
              ${selectedMonth === null
                ? 'bg-[#0B5D3F] text-white shadow-md transform scale-105'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
              }`}
          >
            Összes
          </button>
          {MONTHS.map(m => (
            <button
              key={m.key}
              onClick={() => monthsWithPosts.has(m.key) ? setSelectedMonth(m.key) : undefined}
              disabled={!monthsWithPosts.has(m.key)}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap
                ${selectedMonth === m.key
                  ? 'bg-[#0B5D3F] text-white shadow-md transform scale-105'
                  : monthsWithPosts.has(m.key)
                    ? 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                    : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100'
                }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Betöltés...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-300 mb-2">Hamarosan érkezik...</h2>
            <p className="text-gray-400">Még nincs bejegyzés ebben a hónapban.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredPosts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
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
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 group-hover:text-[#0B5D3F] transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-500 font-medium leading-relaxed line-clamp-3">
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
      </div>
    </div>
  );
}
