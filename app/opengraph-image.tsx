import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "Root-Path — small-team digital engineering";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0b0f0e",
        color: "#f7f9f8",
        padding: 72,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {/* >_rp mark drawn as paths so it does not depend on a bundled mono font */}
        <svg width="120" height="60" viewBox="0 0 160 80">
          <g
            transform="translate(14 0)"
            fill="none"
            strokeWidth="6.5"
            strokeLinecap="square"
          >
            <path d="M16 27 L31 40 L16 53" stroke="#f7f9f8" />
            <path d="M38 56 H58" stroke="#a7c4b0" />
            <path
              d="M68 30 V54 M68 41 C68 34 74 30.5 83 31.5"
              stroke="#f7f9f8"
            />
            <path
              d="M97 30 V63 M97 35 C103 29 119 29 119 41 C119 53 103 55 97 48"
              stroke="#f7f9f8"
            />
          </g>
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          ROOT-PATH
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 64,
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          <div>Small team. Direct access.</div>
          <div style={{ color: "#a7c4b0" }}>Faster decisions.</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a7c4b0" }}>
          &gt; start --build --beyond
        </div>
      </div>
    </div>,
    size,
  );
}
