"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * 장례식장 '저장'과 '최근 본 곳'. 로그인 없이 이 기기 브라우저(localStorage)에만 둡니다.
 * - 서버로 보내지 않습니다. 브라우저 저장소를 못 쓰는 환경(사생활 보호 모드 등)에서는 조용히 빈 목록입니다.
 * - 같은 기기의 다른 탭과도 맞춰집니다(storage 이벤트).
 */
export const SAVED_KEY = "poon:funeral-saved";
export const RECENT_KEY = "poon:funeral-recent";
/** 비교 표가 휴대폰에서도 읽히는 칸 수 */
export const SAVED_MAX = 3;
export const RECENT_MAX = 5;

type ShelfKey = typeof SAVED_KEY | typeof RECENT_KEY;
const EVENT = "poon-shelf";

function readRaw(key: ShelfKey) {
    try {
        return window.localStorage.getItem(key) ?? "";
    } catch {
        return "";
    }
}

function parse(raw: string): string[] {
    if (!raw) return [];
    try {
        const v: unknown = JSON.parse(raw);
        return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
    } catch {
        return [];
    }
}

function write(key: ShelfKey, ids: string[]) {
    try {
        window.localStorage.setItem(key, JSON.stringify(ids));
    } catch {
        // 저장소를 못 쓰면 이번 화면에서만 반영되지 않습니다
    }
    window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
    window.addEventListener("storage", cb);
    window.addEventListener(EVENT, cb);
    return () => {
        window.removeEventListener("storage", cb);
        window.removeEventListener(EVENT, cb);
    };
}

/** 목록 구독. 서버 렌더와 첫 그리기에서는 빈 목록이라 하이드레이션이 어긋나지 않습니다 */
export function useShelf(key: ShelfKey) {
    const raw = useSyncExternalStore(
        subscribe,
        () => readRaw(key),
        () => "",
    );
    return useMemo(() => parse(raw), [raw]);
}

/** 저장을 켜고 끕니다. 꽉 차서 못 넣으면 "full" */
export function toggleSaved(id: string): "added" | "removed" | "full" {
    const ids = parse(readRaw(SAVED_KEY));
    if (ids.includes(id)) {
        write(
            SAVED_KEY,
            ids.filter((x) => x !== id),
        );
        return "removed";
    }
    if (ids.length >= SAVED_MAX) return "full";
    write(SAVED_KEY, [...ids, id]);
    return "added";
}

export function removeSaved(id: string) {
    write(
        SAVED_KEY,
        parse(readRaw(SAVED_KEY)).filter((x) => x !== id),
    );
}

/** 본 곳을 맨 앞에 넣습니다(같은 곳은 한 번만) */
export function pushRecent(id: string) {
    const ids = parse(readRaw(RECENT_KEY)).filter((x) => x !== id);
    write(RECENT_KEY, [id, ...ids].slice(0, RECENT_MAX));
}
