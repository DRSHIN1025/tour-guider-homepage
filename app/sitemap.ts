import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tourguider.biz';
  const now = new Date().toISOString();
  return [
    { url: `${base}/`,               lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/about`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/quote`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/services`,       lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/reviews`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.6 }
  ];
} 