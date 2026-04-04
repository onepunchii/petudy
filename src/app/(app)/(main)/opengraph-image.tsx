import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0D0D14 0%, #1E1E2A 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 30%, rgba(163, 223, 70, 0.15) 0%, transparent 50%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 900, color: "#F5F5F7" }}>
            foon
          </span>
          <span style={{ fontSize: 48, fontWeight: 900, color: "#A3DF46" }}>
            2.0
          </span>
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#8888A0",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          반려동물 모빌리티 플랫폼
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
          }}
        >
          {["건강검진", "장묘", "보험", "여행"].map((item) => (
            <div
              key={item}
              style={{
                padding: "12px 24px",
                borderRadius: 100,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#8888A0",
                fontSize: 18,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
