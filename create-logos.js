// Node.js script to create logo files
// This would require canvas package: npm install canvas

const fs = require('fs');
const path = require('path');

// For now, let's create the HTML structure for the logos
const logoSizes = [
    { size: 16, name: 'favicon-16x16.png', description: 'Small favicon' },
    { size: 32, name: 'favicon-32x32.png', description: 'Standard favicon' },
    { size: 48, name: 'logo-48x48.png', description: 'Browser bookmark' },
    { size: 64, name: 'logo-64x64.png', description: 'Brand logo' },
    { size: 128, name: 'logo-128x128.png', description: 'Large brand logo' },
    { size: 192, name: 'logo-192x192.png', description: 'PWA icon' },
    { size: 512, name: 'logo-512x512.png', description: 'High resolution' }
];

console.log('Logo files needed:');
logoSizes.forEach(logo => {
    console.log(`${logo.name} (${logo.size}x${logo.size}) - ${logo.description}`);
});

// Create a simple SVG that can be converted
const createSVG = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.47}" fill="url(#bg)" stroke="#1D4ED8" stroke-width="${size*0.02}"/>
  <path d="M${size/2} ${size*0.25}L${size/2} ${size*0.55}M${size/2-size*0.08} ${size*0.47}L${size/2} ${size*0.55}L${size/2+size*0.08} ${size*0.47}" stroke="white" stroke-width="${size*0.03}" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="${size*0.35}" y="${size*0.62}" width="${size*0.3}" height="${size*0.23}" rx="${size*0.01}" fill="white" stroke="#E5E7EB" stroke-width="${size*0.008}"/>
  <circle cx="${size*0.41}" cy="${size*0.68}" r="${size*0.025}" fill="#F59E0B"/>
  <path d="M${size*0.38} ${size*0.8}L${size*0.45} ${size*0.73}L${size*0.52} ${size*0.8}L${size*0.59} ${size*0.71}L${size*0.62} ${size*0.75}" stroke="#6B7280" stroke-width="${size*0.006}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  ${size >= 48 ? `<text x="${size/2}" y="${size*0.95}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size*0.08}" font-weight="bold">JPG</text>` : ''}
</svg>`;

// Save SVG files for each size
logoSizes.forEach(logo => {
    const svgContent = createSVG(logo.size);
    const svgPath = path.join('assets', `logo-${logo.size}x${logo.size}.svg`);
    
    try {
        fs.writeFileSync(svgPath, svgContent);
        console.log(`Created: ${svgPath}`);
    } catch (error) {
        console.error(`Error creating ${svgPath}:`, error.message);
    }
});
