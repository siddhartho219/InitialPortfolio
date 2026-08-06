import { ImageResponse } from "next/og";

export const alt = "Siddartho Sarker Bipro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#050816",
          color: "#E2E8F0",
          fontSize: 48,
          fontWeight: 600,
        }}
      >
        Siddartho Sarker Bipro
      </div>
    ),
    { ...size }
  );
}
