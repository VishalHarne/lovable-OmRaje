import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadEnv } from "vite";

const htmlFiles = [
  resolve(".output/public/index.html"),
  resolve(".output/public/videos/index.html"),
];

const apiBaseUrl =
  loadEnv("production", process.cwd(), "VITE_").VITE_API_BASE_URL?.trim() ||
  "https://omraje-email-backend.onrender.com";
const apiUrl = new URL(apiBaseUrl);
if (apiUrl.protocol !== "https:") {
  throw new Error("VITE_API_BASE_URL must use HTTPS.");
}

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src https://challenges.cloudflare.com",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' https: data: blob:",
  "worker-src 'self' blob:",
  `connect-src 'self' ${apiUrl.origin} https://challenges.cloudflare.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.google.com`,
].join("; ");

const securityMetadata = [
  `<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}">`,
  '<meta name="referrer" content="strict-origin-when-cross-origin">',
].join("");

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const headTag = html.match(/<head(?:\s[^>]*)?>/i)?.[0];
  if (!headTag) {
    throw new Error(`Cannot add security metadata: missing <head> in ${file}`);
  }

  const withoutOldMetadata = html
    .replace(/<meta\s+http-equiv="Content-Security-Policy"[^>]*\/?>/gi, "")
    .replace(/<meta\s+name="referrer"[^>]*\/?>/gi, "");
  const hardenedHtml = withoutOldMetadata.replace(
    /<head(?:\s[^>]*)?>/i,
    (match) => `${match}${securityMetadata}`,
  );

  if (hardenedHtml === withoutOldMetadata) {
    throw new Error(`Cannot add security metadata to ${file}`);
  }

  await writeFile(file, hardenedHtml);
}
