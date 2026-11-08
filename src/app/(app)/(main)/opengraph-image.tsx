import { ImageResponse } from "next/og";

// 한글 글꼴: public/fonts/NotoSansKR-Bold.ttf 는 실제 글꼴이 아니라 HTML 파일(다운로드 실패본)이라 쓰지 않습니다.
// next/og 가 한글(Hangul) 글자를 만나면 Google Fonts 의 Noto Sans KR 을 렌더 시점에 받아 그립니다.
// 글꼴을 못 받는 환경에서도 브랜드가 남도록 영문 워드마크 "po-on" 을 함께 둡니다.
export const runtime = "edge";
export const alt = "포온 | 반려동물 기록과 추억";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// next/og 는 Tailwind 토큰을 쓸 수 없어 사이트 팔레트(docs/BRAND_SPACE_CONCEPT.md 5장) hex 값을 그대로 씁니다.
const NIGHT = "#0B1020";
const NIGHT_2 = "#141A2E";
const STAR = "#EEF1F6";
const STAR_2 = "#B4BCCB";
const STAR_3 = "#8C95A8";
const LIME = "#A3DF46"; // 유일한 강조색: 행동(버튼) 모양 한 곳에만
const INK = "#10131A";

// 히어로와 같은 작은 별 (빛 번짐 없이 점만)
const STARS = [
  { x: 96, y: 84, d: 3, o: 0.9 },
  { x: 228, y: 196, d: 2, o: 0.55 },
  { x: 342, y: 62, d: 2, o: 0.7 },
  { x: 168, y: 432, d: 2, o: 0.45 },
  { x: 92, y: 548, d: 3, o: 0.5 },
  { x: 1012, y: 96, d: 3, o: 0.85 },
  { x: 884, y: 54, d: 2, o: 0.6 },
  { x: 1104, y: 238, d: 2, o: 0.65 },
  { x: 958, y: 474, d: 2, o: 0.45 },
  { x: 1120, y: 560, d: 3, o: 0.5 },
  { x: 640, y: 40, d: 2, o: 0.5 },
  { x: 742, y: 586, d: 2, o: 0.4 },
];

const ITEMS = ["내 아이 정보", "추억상자", "예약하기"];

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
          position: "relative",
          background: `linear-gradient(180deg, ${NIGHT} 0%, ${NIGHT} 55%, ${NIGHT_2} 100%)`,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {STARS.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: s.d,
              height: s.d,
              borderRadius: 999,
              background: STAR,
              opacity: s.o,
            }}
          />
        ))}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 24,
          }}
        >
          {/* 사이트 로고(SiteHeader Logo)와 같은 모양: 별빛 원 + 남색 하트 */}
          <svg width="72" height="72" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="15" fill={STAR} />
            <path
              d="M16 23.5c-4.4-2.9-7-5.6-7-8.7 0-2.2 1.6-3.8 3.6-3.8 1.4 0 2.6.8 3.4 2 .8-1.2 2-2 3.4-2 2 0 3.6 1.6 3.6 3.8 0 3.1-2.6 5.8-7 8.7Z"
              fill={NIGHT}
            />
          </svg>
          <span style={{ fontSize: 56, fontWeight: 900, color: STAR }}>
            포온
          </span>
          <span style={{ fontSize: 40, fontWeight: 700, color: STAR_3 }}>
            po-on
          </span>
        </div>

        <div
          style={{
            fontSize: 30,
            color: STAR_2,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          반려동물 기록과 추억
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 44,
          }}
        >
          {ITEMS.map((item, i) => {
            const isAction = i === ITEMS.length - 1;
            return (
              <div
                key={item}
                style={{
                  padding: "12px 26px",
                  borderRadius: 100,
                  background: isAction ? LIME : NIGHT_2,
                  border: isAction ? `1px solid ${LIME}` : "1px solid rgba(238,241,246,0.12)",
                  color: isAction ? INK : STAR_2,
                  fontSize: 20,
                  fontWeight: isAction ? 700 : 500,
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
