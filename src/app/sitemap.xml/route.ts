import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogPosts, products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const baseUrl = 'https://rosti.hu';
  const now = new Date().toISOString();

  // Fetch published blog posts
  let blogSlugs: { slug: string; updatedAt: Date }[] = [];
  try {
    blogSlugs = await db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
      .from(blogPosts)
      .where(eq(blogPosts.published, true));
  } catch {
    // DB unavailable — static pages still work
  }

  // Fetch products
  let productIds: { id: string; name: string }[] = [];
  try {
    productIds = await db
      .select({ id: products.id, name: products.name })
      .from(products);
  } catch {
    // DB unavailable
  }

  const staticPages = [
    { loc: '', changefreq: 'daily', priority: '1.0' },
    { loc: '/modern-shop', changefreq: 'daily', priority: '0.9' },
    { loc: '/osszetevok', changefreq: 'weekly', priority: '0.8' },
    { loc: '/blog', changefreq: 'daily', priority: '0.8' },
    { loc: '/gyik', changefreq: 'monthly', priority: '0.7' },
    { loc: '/adatkezeles', changefreq: 'monthly', priority: '0.3' },
    { loc: '/altalanos-szerzodesi-feltetelek', changefreq: 'monthly', priority: '0.3' },
  ];

  const urlEntries = staticPages.map(
    (p) => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="hu" href="${baseUrl}${p.loc}" />
  </url>`
  );

  // Blog post URLs
  for (const post of blogSlugs) {
    urlEntries.push(`  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="hu" href="${baseUrl}/blog/${post.slug}" />
  </url>`);
  }

  // Product URLs
  for (const product of productIds) {
    urlEntries.push(`  <url>
    <loc>${baseUrl}/products/${product.id}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="hu" href="${baseUrl}/products/${product.id}" />
  </url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
