import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { BlogPostContent } from './blog-post-content';

interface PageProps {
  params: { slug: string };
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
