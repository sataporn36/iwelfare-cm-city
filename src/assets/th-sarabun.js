const fs = require("fs");
const path = require("path");

function encodeBase64(filePath) {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath).toString("base64");
  } else {
    console.error(`Font file not found: ${filePath}`);
    return null;
  }
}

const fontsDir = path.join(__dirname, "fonts");
const outputFile = path.join(__dirname, "fontsBase64.json");

const fonts = {
  "THSarabun-Regular.ttf": encodeBase64(
    path.join(fontsDir, "THSarabun-Regular.ttf")
  ),
  "THSarabun-Bold.ttf": encodeBase64(path.join(fontsDir, "THSarabun-Bold.ttf")),
  "THSarabun-Italic.ttf": encodeBase64(
    path.join(fontsDir, "THSarabun-Italic.ttf")
  ),
  "THSarabun-BoldItalic.ttf": encodeBase64(
    path.join(fontsDir, "THSarabun-BoldItalic.ttf")
  ),
};

// Remove null entries (if any font is missing)
const filteredFonts = Object.fromEntries(
  Object.entries(fonts).filter(([_, v]) => v !== null)
);

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify(filteredFonts, null, 2));

console.log("✅ fontsBase64.json generated successfully!");
