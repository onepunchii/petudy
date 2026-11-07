/**
 * 반려동물 정보 입력 규칙. 등록 마법사, 수정 화면, 서버 액션이 같은 규칙과 문구를 씁니다.
 * 브라우저와 서버 양쪽에서 쓰므로 node 전용 API 를 쓰지 않습니다.
 */

/** DB weight_kg 는 decimal(4,2) 라 99.99 까지 저장됩니다 */
export const PET_WEIGHT_MIN = 0.1;
export const PET_WEIGHT_MAX = 99.9;
/** 달력에서 고를 수 있는 가장 이른 날 */
export const PET_DATE_MIN = "1990-01-01";
export const PET_NAME_MAX = 20;
export const PET_REG_NUMBER_MAX = 15;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** "YYYY-MM-DD" 형식이고 실제로 있는 날짜인지 (2월 30일 등은 거름) */
export function isIsoDate(value: string) {
    if (!ISO_DATE.test(value)) return false;
    const [y, m, d] = value.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/** 오늘 날짜 "YYYY-MM-DD". timeZone 을 주지 않으면 기기 현지 시간 기준 */
export function todayIso(timeZone?: string) {
    // en-CA 는 YYYY-MM-DD 로 씁니다
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/** "YYYY-MM-DD" 에 n 일을 더한 날짜 */
export function addDaysIso(value: string, days: number) {
    const [y, m, d] = value.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + days));
    return date.toISOString().slice(0, 10);
}

/** 몸무게 입력값 오류 문구. 비어 있으면 null (필수 여부는 화면에서 따로 봅니다) */
export function weightError(raw: string | number | null | undefined): string | null {
    if (raw === null || raw === undefined) return null;
    const text = String(raw).trim();
    if (text === "") return null;
    const n = Number(text);
    if (!Number.isFinite(n)) return "숫자로 입력해 주세요";
    if (n < PET_WEIGHT_MIN) return `${PET_WEIGHT_MIN}kg 이상으로 입력해 주세요`;
    if (n > PET_WEIGHT_MAX) return `${PET_WEIGHT_MAX}kg 이하로 입력해 주세요`;
    return null;
}

/**
 * 생일·가족이 된 날 오류 문구. 둘 다 고르지 않아도 됩니다.
 * today 는 화면에서는 기기 날짜, 서버에서는 한국 날짜(+하루 여유)를 넘깁니다.
 */
export function petDatesError(dates: { birth?: string | null; adoptionDate?: string | null }, today = todayIso()): string | null {
    const { birth, adoptionDate } = dates;
    if (birth) {
        if (!isIsoDate(birth)) return "생일 날짜 형식이 올바르지 않아요";
        if (birth > today) return "생일은 오늘 이후 날짜로 정할 수 없어요";
        if (birth < PET_DATE_MIN) return "생일은 1990년 이후 날짜로 골라 주세요";
    }
    if (adoptionDate) {
        if (!isIsoDate(adoptionDate)) return "가족이 된 날 형식이 올바르지 않아요";
        if (adoptionDate > today) return "가족이 된 날은 오늘 이후 날짜로 정할 수 없어요";
        if (adoptionDate < PET_DATE_MIN) return "가족이 된 날은 1990년 이후 날짜로 골라 주세요";
    }
    if (birth && adoptionDate && adoptionDate < birth) return "가족이 된 날이 생일보다 빠를 수 없어요";
    return null;
}

/** 동물등록번호: 숫자만 남깁니다 (띄어쓰기·하이픈 허용) */
export const normalizeRegNumber = (raw: string) => raw.replace(/[\s-]/g, "");

/** 동물등록번호 오류 문구. 비어 있으면 null */
export function regNumberError(raw: string | null | undefined): string | null {
    if (!raw) return null;
    const value = normalizeRegNumber(raw);
    if (value === "") return null;
    if (!/^\d+$/.test(value)) return "동물등록번호는 숫자로만 입력해 주세요";
    if (value.length > PET_REG_NUMBER_MAX) return `동물등록번호는 ${PET_REG_NUMBER_MAX}자리까지예요`;
    return null;
}
