// Generates PNG icons using Canvas (Node.js)
const { createCanvas } = require('canvas');
const fs = require('fs');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#2D1B69');
  grad.addColorStop(1, '#7C3AED');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.22);
  ctx.fill();

  // Star
  ctx.fillStyle = '#F59E0B';
  ctx.font = `bold ${size * 0.45}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦', size / 2, size * 0.42);

  // Text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.13}px sans-serif`;
  ctx.fillText('2026', size / 2, size * 0.78);

  return canvas.toBuffer('image/png');
}

try {
  const { createCanvas } = require('canvas');
  fs.writeFileSync('public/icon-192.png', generateIcon(192));
  fs.writeFileSync('public/icon-512.png', generateIcon(512));
  console.log('Icons generated!');
} catch(e) {
  console.log('canvas not available, using SVG fallback');
}
