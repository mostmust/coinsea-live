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
    return `
  <url>
    <loc>${baseUrl}/${file}</loc>
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
