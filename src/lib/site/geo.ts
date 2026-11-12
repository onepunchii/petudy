/**
 * 거리 계산 도우미. 화면 코드(브라우저)에서도 쓰므로 지역·업체 데이터를 import 하지 않는 작은 파일로 둡니다.
 * regions.ts 가 같은 함수를 다시 내보냅니다.
 */

/** 두 좌표 간 직선거리(km) */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const s =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
}

/**
 * 직선거리 → 차량 예상 소요시간 범위(분).
 * 도로 우회계수 1.35, 한산 시 평균 38km/h ~ 혼잡 시 22km/h 기준의 보수적 추정입니다.
 */
export function estimateDriveMinutes(km: number): [number, number] {
    const road = km * 1.35;
    const fast = Math.max(5, Math.round((road / 38) * 60));
    const slow = Math.max(fast + 5, Math.round((road / 22) * 60));
    return [fast, slow];
}
