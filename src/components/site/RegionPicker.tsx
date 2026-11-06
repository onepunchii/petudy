"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LocateFixed, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

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
    // 약 0.35도(≈35km) 이상 떨어져 있으면 서비스 지역 밖으로 판단
    return Math.sqrt(bestD) > 0.35 ? null : best;
}

export function RegionPicker({
    regions,
    service,
    services,
    variant = "light",
}: {
    regions: PickerRegion[];
    /** 고정 서비스 (서비스 허브에서 사용) */
    service?: string;
    /** 서비스 선택지 (홈에서 사용) */
    services?: { slug: string; short: string }[];
    variant?: "light" | "dark";
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
            setMsg("이 브라우저에서는 위치 확인을 지원하지 않아요. 아래에서 직접 선택해 주세요.");
            return;
        }
        setLocating(true);
        setMsg("");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocating(false);
                const r = nearest(regions, pos.coords.latitude, pos.coords.longitude);
                if (!r) {
                    setMsg("현재 위치는 아직 서비스 지역 밖이에요. 전화로 문의 주시면 가능한 방법을 찾아드릴게요.");
                    return;
                }
                setMsg(`${r.name}(으)로 이동합니다`);
                go(r);
            },
            () => {
                setLocating(false);
                setMsg("위치 권한이 없어 확인하지 못했어요. 아래에서 동네를 직접 선택해 주세요.");
            },
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
        );
    };

    const dark = variant === "dark";
    const field = cn(
        "h-12 w-full rounded-xl border px-3 text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-pine",
        dark ? "border-white/15 bg-white/10 text-white [&>option]:text-ink" : "border-line bg-white text-ink",
    );

    return (
        <div className={cn("rounded-3xl p-5 sm:p-6", dark ? "bg-white/[0.06] ring-1 ring-white/10" : "bg-white ring-1 ring-line shadow-[0_20px_60px_-30px_rgba(27,26,23,0.25)]")}>
            <p className={cn("flex items-center gap-2 text-[15px] font-bold", dark ? "text-white" : "text-ink")}>
                <MapPin className="h-4 w-4" aria-hidden /> 우리 동네에서 가까운 곳 찾기
            </p>
            <button
                type="button"
                onClick={locate}
                disabled={locating}
                className={cn(
                    "mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold transition-colors",
                    dark ? "bg-white text-ink hover:bg-paper" : "bg-pine text-white hover:bg-pine-2",
                )}
            >
                {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                {locating ? "위치 확인 중…" : "내 위치로 바로 찾기"}
            </button>
            <div className={cn("my-4 flex items-center gap-3 text-[12px]", dark ? "text-white/50" : "text-ink-3")}>
                <span className="h-px flex-1 bg-current opacity-30" /> 또는 직접 선택 <span className="h-px flex-1 bg-current opacity-30" />
            </div>
            <form
                className="grid gap-2 sm:grid-cols-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    const r = regions.find((x) => x.slug === slug && x.sido === sido);
                    if (r) go(r);
                    else setMsg("지역을 선택해 주세요.");
                }}
            >
                {services && (
                    <label className="sm:col-span-2">
                        <span className="sr-only">서비스</span>
                        <select className={field} value={svc} onChange={(e) => setSvc(e.target.value)}>
                            {services.map((s) => (
                                <option key={s.slug} value={s.slug}>{s.short}</option>
                            ))}
                        </select>
                    </label>
                )}
                <label>
                    <span className="sr-only">시·도</span>
                    <select className={field} value={sido} onChange={(e) => { setSido(e.target.value as "seoul" | "gyeonggi"); setSlug(""); }}>
                        <option value="seoul">서울특별시</option>
                        <option value="gyeonggi">경기도</option>
                    </select>
                </label>
                <label>
                    <span className="sr-only">시·군·구</span>
                    <select className={field} value={slug} onChange={(e) => setSlug(e.target.value)}>
                        <option value="">구·시 선택</option>
                        {options.map((r) => (
                            <option key={r.slug} value={r.slug}>{r.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit" className={cn("h-12 rounded-xl text-[15px] font-semibold sm:col-span-2", dark ? "bg-white/15 text-white hover:bg-white/25" : "bg-ink text-white hover:bg-pine")}>
                    우리 동네 안내 보기
                </button>
            </form>
            <p aria-live="polite" className={cn("mt-3 min-h-[1.25rem] text-[13px]", dark ? "text-white/70" : "text-ink-3")}>{msg}</p>
        </div>
    );
}
