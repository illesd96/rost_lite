import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/blog/posts/[id] - Get a single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, params.id))
    .limit(1);

  if (post.length === 0) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post[0]);
}

// PUT /api/blog/posts/[id] - Update a post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, excerpt, content, coverImage, month, monthLabel, readingTime, published, authorName } = body;

  // If being published for the first time, set publishedAt
  const existing = await db.select().from(blogPosts).where(eq(blogPosts.id, params.id)).limit(1);
  if (existing.length === 0) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const publishedAt = published && !existing[0].published ? new Date() : existing[0].publishedAt;

  const updated = await db
    .update(blogPosts)
    .set({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImage: coverImage || null,
      month: month || null,
      monthLabel: monthLabel || null,
      readingTime: readingTime || null,
      published: published || false,
      publishedAt,
      authorName: authorName || null,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, params.id))
    .returning();

  return NextResponse.json(updated[0]);
}

// DELETE /api/blog/posts/[id] - Delete a post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await db.delete(blogPosts).where(eq(blogPosts.id, params.id));
  return NextResponse.json({ success: true });
}
