"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, LocateFixed, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { PassCard } from "./PassCard";
import { ICON_STROKE, pillClass } from "./ui";

export interface PickerRegion {
    sido: "seoul" | "gyeonggi";
    slug: string;
    name: string;
    lat: number;
    lng: number;
}

function nearest(list: PickerRegion[], lat: number, lng: number) {
    let best = list[0];
    let bestD = Infinity;
    for (const r of list) {
        const d = (r.lat - lat) ** 2 + ((r.lng - lng) * Math.cos((lat * Math.PI) / 180)) ** 2;
        if (d < bestD) {
            bestD = d;
            best = r;
        }
    }
    // 약 0.35도(약 35km) 이상 떨어져 있으면 서비스 지역 밖으로 판단
    return Math.sqrt(bestD) > 0.35 ? null : best;
}

/** 라벨이 위에 붙은 select. 기본 화살표를 지우고 같은 모양의 아이콘을 얹습니다 */
function SelectField({
    label,
    dark,
    className,
    children,
    ...rest
}: { label: string; dark?: boolean; className?: string; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <label className={cn("grid min-w-0 gap-1.5", className)}>
            <span className={cn("text-[13px] font-semibold", dark ? "text-star-2" : "text-ink-2")}>{label}</span>
            <span className="relative block">
                <select
                    {...rest}
                    className={cn(
                        "h-12 w-full appearance-none truncate rounded-xl border pl-3.5 pr-10 text-[15px] outline-none transition-[border-color,box-shadow] duration-150 focus-visible:ring-2 motion-reduce:transition-none",
                        dark
                            ? // 테두리는 night-2 카드 바탕 대비 3:1 이상(white/35)
                              "border-white/35 bg-night-3 text-star focus-visible:border-star focus-visible:ring-star/30 [&>option]:bg-white [&>option]:text-ink"
                            : "border-ink-3/70 bg-white text-ink focus-visible:border-pine focus-visible:ring-pine/25",
                    )}
                >
                    {children}
                </select>
                <ChevronDown
                    className={cn("pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2", dark ? "text-star-3" : "text-ink-3")}
                    strokeWidth={ICON_STROKE}
                    aria-hidden
                />
            </span>
        </label>
    );
}

/**
 * 동네 선택기. 지역을 고르거나 내 위치로 가장 가까운 지역 페이지로 이동합니다.
 * - light: 밝은 면 위 카드 (서비스 페이지 히어로 아래 띠, 지역 인덱스)
 * - dark: 밤 위 카드 (히어로 오른쪽 칸)
 * - pass: 가로로 긴 탑승권 (홈 히어로 바로 아래). 절취선 너머(stub)에 "내 위치로 찾기"
 */
export function RegionPicker({
    regions,
    service,
    services,
    variant = "light",
    title = "우리 동네에서 가까운 곳 찾기",
    titleAs = "p",
}: {
    regions: PickerRegion[];
    /** 고정 서비스 (서비스 허브에서 사용) */
    service?: string;
    /** 서비스 선택지 (홈에서 사용) */
    services?: { slug: string; short: string }[];
    variant?: "light" | "dark" | "pass";
    /** 카드 제목 */
    title?: string;
    /** 제목 태그. 섹션 제목 역할을 할 때 h2 */
    titleAs?: "p" | "h2" | "h3";
}) {
    const router = useRouter();
    const [sido, setSido] = useState<"seoul" | "gyeonggi">("seoul");
    const [slug, setSlug] = useState("");
    const [svc, setSvc] = useState(service ?? services?.[0]?.slug ?? "");
    const [locating, setLocating] = useState(false);
    const [msg, setMsg] = useState("");
    const options = useMemo(() => regions.filter((r) => r.sido === sido), [regions, sido]);

    const go = (r: PickerRegion) => router.push(svc ? `/${svc}/${r.sido}/${r.slug}` : `/area/${r.sido}/${r.slug}`);

    const locate = () => {
        if (!("geolocation" in navigator)) {
            setMsg("이 브라우저에서는 위치 확인을 지원하지 않아요. 동네를 직접 골라 주세요.");
            return;
        }
        setLocating(true);
        setMsg("");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocating(false);
                const r = nearest(regions, pos.coords.latitude, pos.coords.longitude);
                if (!r) {
                    setMsg("현재 위치는 아직 서비스 지역 밖이에요. 전화로 문의 주시면 가능한 방법을 찾아 드릴게요.");
                    return;
                }
                setMsg(`${r.name} 안내로 이동합니다.`);
                go(r);
            },
            () => {
                setLocating(false);
                setMsg("위치 권한이 없어 확인하지 못했어요. 동네를 직접 골라 주세요.");
            },
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
        );
    };

    const dark = variant === "dark";
    const pass = variant === "pass";
    const Title = titleAs;

    const locateButton = (
        <button
            type="button"
            onClick={locate}
            disabled={locating}
            aria-busy={locating}
            className={cn(pillClass({ tone: dark ? "onNight" : "onLight", variant: "ghost" }), "w-full disabled:cursor-wait disabled:opacity-70")}
        >
            {locating ? (
                <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" strokeWidth={ICON_STROKE} aria-hidden />
            ) : (
                <LocateFixed className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
            )}
            {locating ? "위치 확인 중…" : "내 위치로 찾기"}
        </button>
    );

    const form = (
        <form
            className={cn(
                "grid gap-3",
                pass
                    ? "mt-5 md:grid-cols-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)_minmax(0,1fr)_auto] lg:items-end"
                    : "sm:grid-cols-2",
            )}
            onSubmit={(e) => {
                e.preventDefault();
                const r = regions.find((x) => x.slug === slug && x.sido === sido);
                if (r) go(r);
                else setMsg("구·시를 골라 주세요.");
            }}
        >
            {services && (
                <SelectField
                    label="서비스"
                    dark={dark}
                    value={svc}
                    onChange={(e) => setSvc(e.target.value)}
                    className={pass ? "md:col-span-2 lg:col-span-1" : "sm:col-span-2"}
                >
                    {services.map((s) => (
                        <option key={s.slug} value={s.slug}>
                            {s.short}
                        </option>
                    ))}
                </SelectField>
            )}
            <SelectField
                label="시·도"
                dark={dark}
                value={sido}
                onChange={(e) => {
                    setSido(e.target.value as "seoul" | "gyeonggi");
                    setSlug("");
                }}
            >
                <option value="seoul">서울특별시</option>
                <option value="gyeonggi">경기도</option>
            </SelectField>
            <SelectField label="구·시" dark={dark} value={slug} onChange={(e) => setSlug(e.target.value)}>
                <option value="">구·시 선택</option>
                {options.map((r) => (
                    <option key={r.slug} value={r.slug}>
                        {r.name}
                    </option>
                ))}
            </SelectField>
            <button
                type="submit"
                className={cn(
                    pillClass({ tone: dark ? "onNight" : "onLight", variant: "solid" }),
                    pass ? "md:col-span-2 lg:col-span-1" : "mt-1 sm:col-span-2",
                )}
            >
                우리 동네 찾기
            </button>
        </form>
    );

    const status = (
        <p aria-live="polite" className={cn("mt-3 min-h-[1.25rem] text-[13px] leading-snug", dark ? "text-star-2" : "text-ink-2")}>
            {msg}
        </p>
    );

    if (pass) {
        return (
            <PassCard
                radius="tile"
                mainClassName="p-5 sm:p-7 lg:px-8 lg:pb-5 lg:pt-7"
                stubClassName="justify-center gap-3 p-5 sm:w-56 sm:p-6 lg:w-64 lg:px-7"
                stub={
                    <>
                        <p className="text-[13px] font-semibold text-ink-2">동네 이름을 몰라도 괜찮아요</p>
                        {locateButton}
                        <p className="text-[12.5px] leading-relaxed text-ink-3">위치는 가까운 지역을 고르는 데만 쓰고 저장하지 않아요.</p>
                    </>
                }
            >
                <Title className="text-[19px] font-bold leading-snug text-ink sm:text-[22px]">{title}</Title>
                {form}
                {status}
            </PassCard>
        );
    }

    return (
        <div
            className={cn(
                "rounded-[20px] p-5 sm:p-6",
                dark ? "bg-night-2 ring-1 ring-white/10" : "bg-pass ring-1 ring-line shadow-[0_24px_48px_-30px_rgb(31_39_66/0.35)]",
            )}
        >
            <Title className={cn("flex items-center gap-2 text-[16px] font-bold", dark ? "text-star" : "text-ink")}>
                <MapPin className="h-4 w-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
                {title}
            </Title>
            <div className="mt-4">{locateButton}</div>
            <div className={cn("my-4 flex items-center gap-3 text-[12.5px]", dark ? "text-star-3" : "text-ink-3")}>
                <span className="h-px flex-1 bg-current opacity-40" aria-hidden />
                또는 직접 고르기
                <span className="h-px flex-1 bg-current opacity-40" aria-hidden />
            </div>
            {form}
            {status}
        </div>
    );
}
