"use client";

import { useSyncExternalStore } from "react";
import { todayIso } from "@/lib/pet-rules";

const subscribe = () => () => {};
const getServerToday = () => null;

/**
 * 기기 기준 오늘 "YYYY-MM-DD". 서버 렌더와 하이드레이션 중에는 null 입니다.
 * 서버는 UTC 라 한국 0~9시에는 하루 전 날짜가 되므로, 서버 날짜로 화면을 그리면
 * "오늘 생일"이 잠깐 미래 날짜 오류로 보였다가 사라집니다.
 */
export function useClientToday(): string | null {
    return useSyncExternalStore(subscribe, todayIso, getServerToday);
}
