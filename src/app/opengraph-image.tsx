import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const alt = "Share preview for the configured DannFlow project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0f172a",
          color: "#f8fafc",
          display: "flex",
          height: "100%",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "940px" }}>
          <div style={{ color: "#93c5fd", fontSize: 28, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {siteConfig.name}
          </div>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginTop: "28px" }}>
            {siteConfig.description}
          </div>
          <div style={{ color: "#cbd5e1", fontSize: 30, lineHeight: 1.35, marginTop: "28px" }}>
            Built with DannFlow.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
