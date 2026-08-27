// Generates the footer donate QR codes as ink-on-white SVG,
// matching the site's Swiss paper theme. Payment URLs are the
// same codes reused across the user's repos (source:
// chess-reversal-lab/scripts/generate-donate-qr.mjs).
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile, mkdir } from "node:fs/promises";
import QRCode from "qrcode";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectRoot, "img");

const codes = [
  { name: "alipay-qr", url: "https://qr.alipay.com/fkx16432isyyhmx9ttwpi79" },
  { name: "wechat-qr", url: "wxp://f2f1fJpOcJc7F-MSeLMxALhc6tWu-oohtxueHRbCe98bMy2AmDunimuOJFv-8bjobLBM" },
];

await mkdir(outputDirectory, { recursive: true });

for (const { name, url } of codes) {
  const svg = await QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    color: { dark: "#111111", light: "#ffffff" },
  });
  await writeFile(path.join(outputDirectory, `${name}.svg`), svg, "utf8");
  console.log(`Generated img/${name}.svg`);
}
