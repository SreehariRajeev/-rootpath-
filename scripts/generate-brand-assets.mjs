/**
 * Renders the static brand images the site ships:
 *   public/og.png          1200x630 social preview (Open Graph and Twitter)
 *   app/apple-icon.png     180x180 iOS home-screen icon
 *   app/favicon.ico        16, 32 and 48px, for crawlers and browsers that ask for /favicon.ico
 *
 * They are files rather than routes because the site is a static export on GitHub Pages, which
 * picks a Content-Type from the file extension: an extensionless generated route is served as
 * application/octet-stream and social scrapers can reject it.
 *
 * Run `node scripts/generate-brand-assets.mjs` after changing the mark or the social copy.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { ImageResponse } from "next/og.js";

const root = new URL("../", import.meta.url);
const out = (path) => fileURLToPath(new URL(path, root));

const INK = "#0b0f0e";
const PAPER = "#f7f9f8";
const SAGE = "#a7c4b0";

/** Tiny element factory: satori reads plain `{ type, props }` objects, so no JSX is needed here. */
const h = (type, props, ...children) => ({
  type,
  props: { ...props, children: children.length === 1 ? children[0] : children },
});

/** The `>_rp` mark, drawn as paths so it does not depend on a bundled mono font. Matches app/icon.svg. */
function mark({ width, height, viewBox }) {
  return h(
    "svg",
    { width, height, viewBox },
    h(
      "g",
      {
        transform: "translate(14 0)",
        fill: "none",
        strokeWidth: "6.5",
        strokeLinecap: "square",
      },
      h("path", { d: "M16 27 L31 40 L16 53", stroke: PAPER }),
      h("path", { d: "M38 56 H58", stroke: SAGE }),
      h("path", {
        d: "M68 30 V54 M68 41 C68 34 74 30.5 83 31.5",
        stroke: PAPER,
      }),
      h("path", {
        d: "M97 30 V63 M97 35 C103 29 119 29 119 41 C119 53 103 55 97 48",
        stroke: PAPER,
      }),
    ),
  );
}

async function render(element, width, height) {
  const response = new ImageResponse(element, { width, height });
  return Buffer.from(await response.arrayBuffer());
}

/** A square tile with the mark centred; `viewBox` crops the 160x80 mark with the padding it needs. */
function iconTile(size, viewBox) {
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: INK,
      },
    },
    mark({ width: size, height: size, viewBox }),
  );
}

/** Packs PNG buffers into one .ico. Browsers and Google read PNG-encoded entries. */
function packIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const directory = entries.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });

  return Buffer.concat([header, ...directory, ...entries.map(({ png }) => png)]);
}

const og = h(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: INK,
      color: PAPER,
      padding: 72,
    },
  },
  h(
    "div",
    { style: { display: "flex", alignItems: "center", gap: 28 } },
    mark({ width: 120, height: 60, viewBox: "0 0 160 80" }),
    h(
      "div",
      {
        style: {
          display: "flex",
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        },
      },
      "ROOT-PATH",
    ),
  ),
  h(
    "div",
    { style: { display: "flex", flexDirection: "column", gap: 20 } },
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          fontSize: 64,
          fontWeight: 500,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
        },
      },
      h("div", {}, "Small team. Direct access."),
      h("div", { style: { color: SAGE } }, "Faster decisions."),
    ),
    h(
      "div",
      { style: { display: "flex", fontSize: 26, color: SAGE } },
      "> start --build --beyond",
    ),
  ),
);

// Tight crops for the small sizes, a little more air for the home-screen icon.
const favicon = (size) => render(iconTile(size, "20 -23 126 126"), size, size);

await mkdir(out("public"), { recursive: true });
await writeFile(out("public/og.png"), await render(og, 1200, 630));
await writeFile(
  out("app/apple-icon.png"),
  await render(iconTile(180, "8 -35 150 150"), 180, 180),
);
await writeFile(
  out("app/favicon.ico"),
  packIco(
    await Promise.all(
      [16, 32, 48].map(async (size) => ({ size, png: await favicon(size) })),
    ),
  ),
);

console.log("Wrote public/og.png, app/apple-icon.png and app/favicon.ico");
