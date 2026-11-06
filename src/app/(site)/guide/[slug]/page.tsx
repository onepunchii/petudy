import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Info } from "lucide-react";
import { GUIDES, getGuide, type Block } from "@/lib/site/guides";
import { getService } from "@/lib/site/services";
import { articleLd, breadcrumbLd, faqLd } from "@/lib/site/schema";
import { ConsultSection } from "@/components/site/sections";
import { Breadcrumbs, CallButton, Container, FaqList, JsonLd } from "@/components/site/ui";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const g = getGuide((await params).slug);
    if (!g) return {};
    return {
        title: g.title,
        description: g.description,
        keywords: g.keywords,
        alternates: { canonical: `/guide/${g.slug}` },
        openGraph: { type: "article", title: g.title, description: g.description, url: `/guide/${g.slug}`, modifiedTime: g.updated },
    };
}

function renderBlock(b: Block, i: number) {
    if ("h2" in b) return <h2 key={i}>{b.h2}</h2>;
    if ("h3" in b) return <h3 key={i}>{b.h3}</h3>;
    if ("p" in b) return <p key={i}>{b.p}</p>;
    if ("ul" in b) return <ul key={i}>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul>;
    if ("ol" in b) return <ol key={i}>{b.ol.map((x) => <li key={x}>{x}</li>)}</ol>;
    if ("note" in b)
        return (
            <div key={i} className="my-6 flex gap-3 rounded-2xl bg-pine-soft/70 p-5 text-[15px] leading-relaxed text-ink">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-pine" aria-hidden />
                <span>{b.note}</span>
            </div>
        );
    return (
        <div key={i} className="my-6 overflow-x-auto rounded-2xl ring-1 ring-line">
            <table className="w-full min-w-[480px] bg-white text-left text-[14.5px]">
                <thead className="bg-paper-2/70 text-[13px] text-ink-2">
                    <tr>{b.table.head.map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-line">
                    {b.table.rows.map((row) => (
                        <tr key={row.join("|")}>
                            {row.map((cell, j) => (j === 0 ? <th key={j} scope="row" className="px-4 py-3 font-semibold text-ink">{cell}</th> : <td key={j} className="px-4 py-3 text-ink-2">{cell}</td>))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default async function GuidePage({ params }: Props) {
    const g = getGuide((await params).slug);
    if (!g) notFound();
    const service = getService(g.service)!;
    const path = `/guide/${g.slug}`;
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "보호자 가이드", href: "/guide" },
        { name: g.title, href: path },
    ];
    const related = GUIDES.filter((x) => x.service === g.service && x.slug !== g.slug).slice(0, 4);

    return (
        <>
            <JsonLd data={[breadcrumbLd(crumbs), articleLd({ title: g.title, description: g.description, path, updated: g.updated }), ...(g.faqs ? [faqLd(g.faqs)] : [])]} />
            <Container className="pt-6">
                <Breadcrumbs items={crumbs} />
            </Container>
            <article className="py-10 sm:py-14">
                <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="max-w-2xl">
                        <p className="text-[14px] font-semibold text-pine">{service.name} 가이드</p>
                        <h1 className="mt-3 text-[30px] font-extrabold leading-[1.3] text-ink sm:text-[38px]">{g.title}</h1>
                        <p className="mt-4 text-[13px] text-ink-3">
                            <time dateTime={g.updated}>{g.updated}</time> 업데이트 · 포온 편집팀
                        </p>
                        <div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-line">
                            <p className="text-[14px] font-bold text-ink">핵심 요약</p>
                            <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink-2">
                                {g.summary.map((s) => (
                                    <li key={s} className="flex gap-2"><span className="text-pine">·</span>{s}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="prose-site mt-6 text-[16px]">{g.body.map(renderBlock)}</div>
                        {g.faqs && (
                            <div className="mt-12">
                                <h2 className="mb-4 text-[20px] font-bold text-ink">자주 묻는 질문</h2>
                                <FaqList faqs={g.faqs} />
                            </div>
                        )}
                        {g.sources && (
                            <div className="mt-10 border-t border-line pt-6">
                                <p className="text-[13px] font-bold text-ink-2">참고 자료</p>
                                <ul className="mt-2 space-y-1.5 text-[13px] text-ink-3">
                                    {g.sources.map((s) => (
                                        <li key={s.url}>
                                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-ink">
                                                {s.label} <ExternalLink className="h-3 w-3" aria-hidden />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-3xl bg-ink p-6 text-white">
                            <p className="text-[15px] font-bold">{service.available24h ? "지금 도움이 필요하신가요?" : "우리 동네에서 찾고 계신가요?"}</p>
                            <p className="mt-2 text-[14px] leading-relaxed text-white/70">계신 동네를 알려주시면 가까운 {service.license.type === "허가" ? "허가" : "등록"} 업체와 비용을 먼저 확인해 드립니다.</p>
                            <CallButton tone="light" className="mt-5 w-full px-3 text-[14px]" label="상담" />
                            <Link href={`/${service.slug}#regions`} className="mt-3 block text-center text-[13.5px] font-semibold text-white/80 underline-offset-2 hover:underline">
                                지역별 {service.short} 안내 보기
                            </Link>
                        </div>
                        {related.length > 0 && (
                            <div className="mt-6">
                                <p className="text-[13px] font-bold text-ink-2">함께 읽으면 좋은 글</p>
                                <ul className="mt-3 space-y-2">
                                    {related.map((x) => (
                                        <li key={x.slug}>
                                            <Link href={`/guide/${x.slug}`} className="block rounded-2xl bg-white p-4 text-[14px] font-semibold leading-snug text-ink ring-1 ring-line hover:ring-ink/20">
                                                {x.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </aside>
                </Container>
            </article>
            <ConsultSection service={service} />
        </>
    );
}
