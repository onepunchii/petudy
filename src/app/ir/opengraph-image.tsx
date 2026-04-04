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
          background: "linear-gradient(135deg, #0D0D14 0%, #12121E 100%)",
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
              "radial-gradient(circle at 70% 50%, rgba(163, 223, 70, 0.12) 0%, transparent 50%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 36, fontWeight: 900, color: "#F5F5F7" }}>
              Po-
            </span>
            <span style={{ fontSize: 36, fontWeight: 900, color: "#A3DF46" }}>
              On
            </span>
          </div>

          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: "#F5F5F7",
              letterSpacing: "-2px",
            }}
          >
            마지막까지
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: "#A3DF46",
              letterSpacing: "-2px",
            }}
          >
            품어드립니다
          </div>
        </div>

        <div
          style={{
            fontSize: 22,
            color: "#8888A0",
            textAlign: "center",
            marginTop: 24,
          }}
        >
          반려동물 장례 전문 에이전시 플랫폼
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 40,
          }}
        >
          {[
            { value: "3,000억", label: "시장 규모" },
            { value: "15%+", label: "연평균 성장률" },
            { value: "7,000만원", label: "Seed 투자" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px 28px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 900, color: "#A3DF46" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 14, color: "#8888A0", marginTop: 4 }}>
                {stat.label}
              </div>
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
