import sharp from 'sharp'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '../public')

// SVG icon: navy background, yellow "30" in Archivo Black style, blue "SECONDS" beneath
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <!-- Background -->
  <rect width="512" height="512" rx="112" fill="#1A1F3A"/>

  <!-- Yellow "30" -->
  <text
    x="256"
    y="295"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="Arial Black, sans-serif"
    font-weight="900"
    font-size="272"
    letter-spacing="-12"
    fill="#F5E06E"
  >30</text>

  <!-- Blue "SECONDS" -->
  <text
    x="256"
    y="408"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="Arial, sans-serif"
    font-weight="700"
    font-size="58"
    letter-spacing="10"
    fill="#7BB8D4"
  >SECONDS</text>
</svg>
`

const svgBuffer = Buffer.from(svg)

const sizes = [
  { name: 'apple-touch-icon.png',   size: 180 },
  { name: 'icon-192.png',           size: 192 },
  { name: 'icon-512.png',           size: 512 },
  { name: 'favicon-32.png',         size: 32  },
]

for (const { name, size } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(resolve(publicDir, name))
  console.log(`✓ ${name} (${size}x${size})`)
}

// Also write the SVG source for reference
writeFileSync(resolve(publicDir, 'icon.svg'), svg)
console.log('✓ icon.svg')
console.log('All icons generated.')
