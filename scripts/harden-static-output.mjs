import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const htmlFiles = [
  resolve(".output/public/index.html"),
  resolve(".output/public/videos/index.html"),
];

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const headTag = html.match(/<head(?:\s[^>]*)?>/i)?.[0];
  if (!headTag) {
    throw new Error(`Cannot add security metadata: missing <head> in ${file}`);
  }

  const inlineScriptHashes = Array.from(
    html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi),
  )
    .filter(([, attributes, content]) => !/\bsrc\s*=/i.test(attributes) && content.length > 0)
    .map(([, , content]) => {
      const digest = createHash("sha256").update(content).digest("base64");
      return `'sha256-${digest}'`;
    });

  if (inlineScriptHashes.length === 0) {
    throw new Error(`Cannot add script policy: no inline scripts found in ${file}`);
  }

  const policy = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "form-action 'self'",
    `script-src 'self' ${inlineScriptHashes.join(" ")}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' https: data: blob:",
    "connect-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
  const securityMetadata =
    `<meta http-equiv="Content-Security-Policy" content="${policy}">` +
    '<meta name="referrer" content="strict-origin-when-cross-origin">';

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
