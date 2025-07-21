const fs = require('fs');
const path = require('path');

exports.handler = async () => {
  const baseUrl = 'https://coinsea.co.kr';
  const publicDir = path.join(__dirname, '../../public');

  let htmlFiles = [];

  try {
    htmlFiles = fs.readdirSync(publicDir)
      .filter(file => file.endsWith('.html'));
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Error reading public directory',
    };
  }

  const urls = htmlFiles.map(file => {
    const fullPath = path.join(publicDir, file);

    // 파일의 최종 수정일 가져오기
    let lastmod = '';
    try {
      const stats = fs.statSync(fullPath);
      lastmod = stats.mtime.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    } catch (err) {
      lastmod = new Date().toISOString().split('T')[0]; // 에러 시 오늘 날짜
    }

    return `
  <url>
    <loc>${baseUrl}/${file}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
    body: sitemap,
  };
};
