"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyPetsOrThrow } from "@/actions/pet";
import { SUPABASE_READY } from "@/lib/supabase/ready";

/**
 * 내 아이 목록. 로그인하지 않았으면 [], 불러오기에 실패하면 isError (한 번만 다시 시도).
 * 로그인·DB 연결 값이 없으면(SUPABASE_READY=false) 요청하지 않습니다(빈 목록, 오류 아님).
 */
export function usePets() {
    return useQuery({
        queryKey: ["pets"],
        queryFn: () => getMyPetsOrThrow(),
        retry: 1,
        enabled: SUPABASE_READY,
    });
}
