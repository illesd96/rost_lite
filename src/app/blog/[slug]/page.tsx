import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { BlogPostContent } from './blog-post-content';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, params.slug))
    .limit(1);

  if (post.length === 0 || !post[0].published) {
    return { title: 'Cikk nem található - Rosti Blog' };
  }

  const p = post[0];
  const title = `${p.title} - Rosti Blog`;
  const description = p.excerpt || `${p.title} - Olvasd el a Rosti blogon.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://rosti.hu/blog/${p.slug}`,
      type: 'article',
      ...(p.coverImage && {
        images: [{ url: p.coverImage, width: 1200, height: 630, alt: p.title }],
      }),
      locale: 'hu_HU',
      siteName: 'Rosti',
      ...(p.publishedAt && { publishedTime: new Date(p.publishedAt).toISOString() }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(p.coverImage && { images: [p.coverImage] }),
    },
    alternates: {
      canonical: `https://rosti.hu/blog/${p.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, params.slug))
    .limit(1);

  if (post.length === 0 || !post[0].published) {
    notFound();
  }

  return <BlogPostContent post={post[0]} />;
}
