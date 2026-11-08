"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyPetsOrThrow } from "@/actions/pet";

/** 내 아이 목록. 로그인하지 않았으면 [], 불러오기에 실패하면 isError (한 번만 다시 시도) */
export function usePets() {
    return useQuery({
        queryKey: ["pets"],
        queryFn: () => getMyPetsOrThrow(),
        retry: 1,
    });
}
