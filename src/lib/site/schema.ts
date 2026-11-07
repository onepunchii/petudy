/** schema.org 구조화 데이터 빌더 */
import { SITE, absoluteUrl } from "./config";
import type { Faq } from "./services";

export const organizationLd = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#org"),
    name: SITE.fullName,
    alternateName: [SITE.name, SITE.brand],
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.company.email,
    areaServed: [
        { "@type": "AdministrativeArea", name: "서울특별시" },
        { "@type": "AdministrativeArea", name: "경기도" },
    ],
});

export const websiteLd = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: SITE.fullName,
    url: SITE.url,
    inLanguage: "ko-KR",
    publisher: { "@id": absoluteUrl("/#org") },
});

/**
 * 경로(BreadcrumbList). 네이버 가이드는 "홈", "top" 같은 일반 단어를 name 으로 쓰지 말라고 하므로
 * 첫 항목이 홈("/")이면 JSON-LD 에서만 사이트 이름("포온")으로 바꿉니다. 화면의 경로 표시는 그대로입니다.
 */
export const breadcrumbLd = (items: { name: string; href: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: i === 0 && it.href === "/" ? SITE.name : it.name,
        item: absoluteUrl(it.href),
    })),
});

export const faqLd = (faqs: Faq[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
});

export const serviceLd = (opts: { name: string; description: string; path: string; serviceType: string; areaName?: string }) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    url: absoluteUrl(opts.path),
    provider: { "@id": absoluteUrl("/#org") },
    areaServed: opts.areaName ? { "@type": "AdministrativeArea", name: opts.areaName } : [
        { "@type": "AdministrativeArea", name: "서울특별시" },
        { "@type": "AdministrativeArea", name: "경기도" },
    ],
});

/** image: 대표 이미지(og:image 와 같은 그림). 경로를 주면 절대 URL 로 바꿉니다 */
export const articleLd = (opts: { title: string; description: string; path: string; updated: string; image?: string }) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    ...(opts.image ? { image: [/^https?:\/\//.test(opts.image) ? opts.image : absoluteUrl(opts.image)] } : {}),
    dateModified: opts.updated,
    datePublished: opts.updated,
    mainEntityOfPage: absoluteUrl(opts.path),
    author: { "@id": absoluteUrl("/#org") },
    publisher: { "@id": absoluteUrl("/#org") },
    inLanguage: "ko-KR",
});
