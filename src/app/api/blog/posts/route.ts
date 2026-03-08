import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

// GET /api/blog/posts - List published posts (public) or all posts (admin)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const adminMode = searchParams.get('admin') === 'true';

  if (adminMode) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    return NextResponse.json(posts);
  }

  // Public: only published posts
  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.publishedAt));

  return NextResponse.json(posts);
}

// POST /api/blog/posts - Create a new post (admin only)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, excerpt, content, coverImage, month, monthLabel, readingTime, published, authorName } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
  }

  const post = await db.insert(blogPosts).values({
    title,
    slug,
    excerpt: excerpt || null,
    content,
    coverImage: coverImage || null,
    month: month || null,
    monthLabel: monthLabel || null,
    readingTime: readingTime || null,
    published: published || false,
    publishedAt: published ? new Date() : null,
    authorName: authorName || null,
  }).returning();

  return NextResponse.json(post[0], { status: 201 });
}
