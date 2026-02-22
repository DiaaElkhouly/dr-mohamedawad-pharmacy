const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [192, 512];

async function generateIcons() {
  const inputPath = path.join(__dirname, "..", "public", "logo.png");
  const outputDir = path.join(__dirname, "..", "public");

  // Check if logo exists
  if (!fs.existsSync(inputPath)) {
    console.error("Logo not found at:", inputPath);
    console.log("Please add a logo.png file to the public folder");
    process.exit(1);
  }

  console.log("Generating PWA icons...");

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `logo-${size}x${size}.png`);

    try {
      await sharp(inputPath)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Created ${size}x${size} icon`);
    } catch (error) {
      console.error(`✗ Failed to create ${size}x${size} icon:`, error.message);
    }
  }

  console.log("\nIcon generation complete!");
  console.log("Files created:");
  console.log("  - public/logo-192x192.png");
  console.log("  - public/logo-512x512.png");
}

generateIcons().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
