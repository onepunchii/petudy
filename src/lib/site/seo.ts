import type { Metadata } from "next";
import { SITE } from "./config";
import { ogImagePath } from "./funeral-homes";

/**
 * 대표 이미지가 있는 페이지 메타데이터.
 * Next 메타데이터는 얕은 병합이라 openGraph 를 쓰면 type/locale/siteName 을 매번 다시 넣어야 합니다.
 * og:image 는 정사각형 1200x1200 (네이버 썸네일), twitter:image 는 와이드 1200x630 이 있으면 그것을 씁니다.
 */
export function metaWithImage({
    title,
    description,
    path,
    imageAlt,
    wide = false,
    keywords,
    noindex = false,
}: {
    title: string;
    description: string;
    path: string;
    imageAlt: string;
    /** /og{path}/wide.png 라우트가 있을 때만 true */
    wide?: boolean;
    keywords?: string[];
    noindex?: boolean;
}): Metadata {
    const square = ogImagePath(path, "square");
    return {
        title,
        description,
        keywords,
        alternates: { canonical: path },
        robots: noindex ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large" },
        openGraph: {
            type: "website",
            locale: "ko_KR",
            siteName: SITE.fullName,
            url: path,
            title,
            description,
            images: [{ url: square, width: 1200, height: 1200, alt: imageAlt, type: "image/png" }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [wide ? ogImagePath(path, "wide") : square],
        },
    };
}
