import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tocgolezortnknflfian.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      // 사진 업로드(uploadPetPhoto)는 4MB 까지 받습니다(src/lib/pet-photo.ts). 기본값 1MB 면 원본 사진이 경계에서 실패하고,
      // Vercel 은 요청 본문을 4.5MB 까지만 받으므로 그 이상으로 올리면 서버에 닿기 전에 끊깁니다
      bodySizeLimit: "4.5mb",
      allowedOrigins: [
        "192.168.35.181:3000",
        "localhost:3000",
        "foon.app",
        "www.foon.app",
        "foon-official.vercel.app"
      ],
    },
  },
  // 정리된 앱 화면 → 사이트/앱 홈으로 보냅니다 (페이지 파일은 남겨둠).
  async redirects() {
    return [
      // 파트너 문의는 사이트의 제휴 모집 페이지로 영구 이전
      { source: "/partner/inquiry", destination: "/partners", permanent: true },
      // 장례 소개·상조 → 사이트 장례 허브
      { source: "/intro", destination: "/funeral", permanent: false },
      { source: "/life/sangjo", destination: "/funeral", permanent: false },
      // 보험·여행·후기·공유 추모관 → 홈 (앱 홈이 사이트 홈으로 합쳐져 바로 "/" 로)
      { source: "/life/insurance", destination: "/", permanent: false },
      { source: "/life/travel", destination: "/", permanent: false },
      { source: "/reviews", destination: "/", permanent: false },
      { source: "/memorial-shared", destination: "/", permanent: false },
      // 구 MAPS 랜딩 → 사이트 홈
      { source: "/maps", destination: "/", permanent: false },
      // 앱 홈을 사이트 홈으로 합쳤습니다(2026-11-07). 페이지 파일은 되돌릴 수 있게 남겨 둡니다.
      { source: "/app", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
