import { ImageResponse } from "next/og";

export const alt = "Root-Path — small-team digital engineering";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f7f9f8",
          color: "#0b0f0e",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#185e3f",
          }}
        >
          ROOT-PATH
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 64,
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            <div>Small team. Direct access.</div>
            <div style={{ color: "#185e3f" }}>Faster decisions.</div>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#4d5d55" }}>
            Web · Mobile · Cloud · Technical strategy
          </div>
        </div>
      </div>
    ),
    size,
  );
}
