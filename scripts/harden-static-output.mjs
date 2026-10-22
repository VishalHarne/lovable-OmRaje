import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const htmlFiles = [
  resolve(".output/public/index.html"),
  resolve(".output/public/videos/index.html"),
];

const securityMetadata = [
  "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self'; base-uri 'self'; object-src 'none'; frame-src 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' https: data: blob:; connect-src 'self'; upgrade-insecure-requests\">",
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
