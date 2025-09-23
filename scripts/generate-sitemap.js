import fs from 'fs';
import path from 'path';

const baseUrl = 'https://rajeshlingala-portfolio.vercel.app';
const currentDate = new Date().toISOString().split('T')[0];

const staticPages = [
  {
    url: '/',
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: '1.0',
    images: [
      {
        loc: 'https://firebasestorage.googleapis.com/v0/b/myprofolio-34d7c.firebasestorage.app/o/profile%2FWhatsApp%20Image%202025-04-20%20at%2018.48.10_4a2d17cb.jpg?alt=media&token=5ac51520-47e7-4799-ab7a-439ef0a4efc2',
        title: 'Rajesh Lingala - Frontend React Developer',
        caption: 'Professional portfolio of Rajesh Lingala, Frontend React Developer from India'
      }
    ]
  },
  {
    url: '/whoiam',
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.9'
  },
  {
    url: '/projects',
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    url: '/certificates',
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    url: '/blog',
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: '0.8'
  }
];

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;

    if (page.images) {
      page.images.forEach(image => {
        sitemap += `
    <image:image>
      <image:loc>${image.loc}</image:loc>
      <image:title>${image.title}</image:title>
      <image:caption>${image.caption}</image:caption>
    </image:image>`;
      });
    }

    sitemap += `
  </url>
`;
  });

  sitemap += `</urlset>`;

  // Write sitemap to public directory
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated successfully!');
}

// Run the function
generateSitemap();