"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2, LocateFixed, Phone } from "lucide-react";
import { distanceKm, estimateDriveMinutes } from "@/lib/site/geo";
import { cn } from "@/lib/utils";
import { ICON_STROKE, pillClass } from "../ui";

export interface FinderHome {
    id: string;
    name: string;
    place: string;
    path: string;
    phone: string | null;
    lat: number;
    lng: number;
    /** 홈페이지에서 확인된 사실만 (예: "개별 화장") */
    facts: string[];
    /** "14만 원부터" 또는 null */
    priceFrom: string | null;
}

export interface FinderRegion {
    id: string;
    name: string;
    group: string;
    lat: number;
    lng: number;
}

type Status = { kind: "idle" } | { kind: "locating" } | { kind: "error"; message: string } | { kind: "done"; from: string };

const SHOW = 3;

/** 전화 걸기용: 숫자와 + 만 남깁니다 */
const tel = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, "")}`;

/**
 * 내 위치 또는 동네로 가까운 허가 장례식장 3곳을 찾습니다.
 * - 위치는 이 화면 안에서 거리 계산에만 쓰고 서버로 보내거나 저장하지 않습니다.
 * - 위치를 쓸 수 없으면 동네 고르기로 안내하고 그 칸으로 초점을 옮깁니다.
 * - 결과가 바뀌면 화면 읽기 프로그램에 한 줄로 알립니다(aria-live).
 */
export function NearestFinder({
    homes,
    regions,
    allHref,
    checkedAt,
}: {
    homes: FinderHome[];
    regions: FinderRegion[];
    allHref: string;
    checkedAt: string;
}) {
    const [status, setStatus] = useState<Status>({ kind: "idle" });
    const [results, setResults] = useState<{ home: FinderHome; km: number }[]>([]);
    const [regionId, setRegionId] = useState("");
    const selectRef = useRef<HTMLSelectElement>(null);
    const selectId = useId();

    const groups = regions.reduce<Record<string, FinderRegion[]>>((acc, r) => {
        (acc[r.group] ??= []).push(r);
        return acc;
    }, {});

    function show(pos: { lat: number; lng: number }, from: string) {
        const near = homes
            .map((home) => ({ home, km: distanceKm(pos, home) }))
            .sort((a, b) => a.km - b.km)
            .slice(0, SHOW);
        setResults(near);
        setStatus({ kind: "done", from });
    }

    function locate() {
        if (!("geolocation" in navigator)) {
            setStatus({ kind: "error", message: "이 브라우저에서는 위치를 쓸 수 없어요. 아래에서 동네를 골라 주세요." });
            selectRef.current?.focus();
            return;
        }
        setStatus({ kind: "locating" });
        navigator.geolocation.getCurrentPosition(
            (p) => {
                setRegionId("");
                show({ lat: p.coords.latitude, lng: p.coords.longitude }, "지금 위치");
            },
            (err) => {
                setStatus({
                    kind: "error",
                    message:
                        err.code === err.PERMISSION_DENIED
                            ? "위치 권한이 꺼져 있어요. 아래에서 동네를 골라 주세요."
                            : "위치를 찾지 못했어요. 아래에서 동네를 골라 주세요.",
                });
                selectRef.current?.focus();
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
        );
    }

    function pickRegion(id: string) {
        setRegionId(id);
        const r = regions.find((x) => x.id === id);
        if (r) show(r, r.name);
    }

    const announce =
        status.kind === "locating"
            ? "위치를 확인하고 있어요."
            : status.kind === "error"
              ? status.message
              : status.kind === "done"
                ? `${status.from} 기준으로 가까운 허가 장례식장 ${results.length}곳을 찾았어요.`
                : "";

    return (
        <div className="mt-6">
            <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end">
                <button
                    type="button"
                    onClick={locate}
                    disabled={status.kind === "locating"}
                    className={cn(pillClass({ tone: "onLight", variant: "solid" }), "w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto")}
                >
                    {status.kind === "locating" ? (
                        <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" strokeWidth={ICON_STROKE} aria-hidden />
                    ) : (
                        <LocateFixed className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
                    )}
                    내 위치로 찾기
                </button>
                <div>
                    <label htmlFor={selectId} className="text-[14px] font-semibold text-ink-2">
                        또는 동네 고르기
                    </label>
                    <select
                        id={selectId}
                        ref={selectRef}
                        value={regionId}
                        onChange={(e) => pickRegion(e.target.value)}
                        className="mt-1.5 h-12 w-full rounded-2xl bg-moon px-4 text-[16px] text-ink ring-1 ring-inset ring-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                        <option value="">구·시를 골라 주세요</option>
                        {Object.entries(groups).map(([group, list]) => (
                            <optgroup key={group} label={group}>
                                {list.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
            </div>

            <p aria-live="polite" className={cn("mt-3 min-h-[1.5em] text-[14px]", status.kind === "error" ? "font-semibold text-danger" : "text-ink-3")}>
                {/* 결과를 찾았을 때 알림은 화면 읽기 프로그램에만(눈에는 아래 결과 제목이 보임) */}
                <span className={cn(status.kind === "done" && "sr-only")}>{announce}</span>
            </p>

            {status.kind === "done" && results.length > 0 && (
                <>
                    <p className="mt-1 text-[14px] font-semibold text-ink-2">{status.from} 기준 가까운 순서</p>
                    <ol className="mt-3 grid gap-3 lg:grid-cols-3">
                        {results.map(({ home, km }) => {
                            const [fast, slow] = estimateDriveMinutes(km);
                            return (
                                <li key={home.id} className="flex flex-col rounded-[20px] bg-moon p-4 ring-1 ring-line sm:p-5">
                                    <h3 className="text-[18px] font-bold leading-snug text-ink">{home.name}</h3>
                                    <p className="mt-1 text-[14px] text-ink-2">
                                        {home.place} · 약 <span className="tabular-nums">{km < 1 ? "1" : Math.round(km)}</span>km, 차로 약{" "}
                                        <span className="tabular-nums">
                                            {fast}~{slow}
                                        </span>
                                        분
                                    </p>
                                    {home.facts.length > 0 && (
                                        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[14px] font-medium text-ink">
                                            {home.facts.map((f) => (
                                                <li key={f} className="flex items-center gap-1.5">
                                                    <Check className="h-4 w-4 shrink-0 text-pine" strokeWidth={ICON_STROKE} aria-hidden />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {home.priceFrom && <p className="mt-2 text-[14px] text-ink-2">공개 장례 가격 {home.priceFrom}</p>}
                                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                                        {home.phone ? (
                                            <a href={tel(home.phone)} className={cn(pillClass({ tone: "onLight", variant: "solid", size: "sm" }), "flex-1")}>
                                                <Phone className="h-4 w-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
                                                <span className="sr-only">{home.name}에 </span>전화 <span className="tabular-nums">{home.phone}</span>
                                            </a>
                                        ) : (
                                            <p className="flex-1 self-center text-[14px] text-ink-3">공개된 전화번호가 없어요</p>
                                        )}
                                        <Link href={home.path} className={pillClass({ tone: "onLight", variant: "ghost", size: "sm" })}>
                                            자세히<span className="sr-only"> {home.name} 정보 보기</span>
                                        </Link>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                    <p className="mt-4 text-[13px] leading-relaxed text-ink-3">
                        직선거리로 잰 대략 거리예요. 업체 정보는 공식 허가 목록과 업체 홈페이지 기준이고(확인일 {checkedAt}), 위치는 이 화면에서만 쓰고 저장하지 않아요.
                    </p>
                </>
            )}

            <Link
                href={allHref}
                className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-pine underline-offset-4 hover:underline"
            >
                허가 장례식장 전체 목록
                <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
            </Link>
        </div>
    );
}
