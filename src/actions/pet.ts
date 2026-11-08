"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
    addDaysIso,
    normalizeRegNumber,
    petDatesError,
    petNameError,
    regNumberError,
    todayIso,
    weightError,
} from "@/lib/pet-rules";

export interface Pet {
    id: string;
    name: string;
    photo_url: string | null;
    gender: "male" | "female";
    breed: string | null;
    birth_date: string | null;
    concerns: string[] | null;
    species: string | null;
    registration_number: string | null;
    /** true 중성화함 / false 안 함 / null 모름 */
    neuter: boolean | null;
    weight: string | null;
    color: string | null;
    adoption_date: string | null;
}

// Type definition for incoming form data
export interface PetFormData {
    name: string;
    species: "dog" | "cat";
    breed: string | null;
    gender: "male" | "female";
    neuter: boolean | null;
    birth: string | null; // "YYYY-MM-DD"
    weight: string | null;
    color: string | null;
    concern: string[] | null;
    photo: string | null;
    reg_number: string | null;
    adoptionDate: string | null;
}

/**
 * 등록·수정·삭제 결과. 서버 액션이 예외를 던지면 배포 환경에서 메시지가 가려지므로
 * 예외 대신 사용자에게 보여 줄 한국어 문구를 돌려줍니다.
 */
export type PetActionResult =
    | { success: true; petId?: string }
    | { success: false; code: "auth" | "invalid" | "duplicate" | "server"; error: string };

const AUTH_ERROR = { success: false, code: "auth", error: "로그인이 필요해요. 다시 로그인한 뒤 시도해 주세요." } as const;
const SERVER_ERROR = { success: false, code: "server", error: "서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요." } as const;
const SAVE_ERROR = { success: false, code: "server", error: "저장하지 못했어요. 잠시 후 다시 시도해 주세요." } as const;
const invalid = (error: string) => ({ success: false, code: "invalid", error }) as const;

/** pets 테이블 행 (src/lib/db/schema.ts) */
interface DbPetRow {
    pet_id: string;
    pet_name: string;
    profile_photo_url: string | null;
    gender: "MALE" | "FEMALE";
    breed: string | null;
    birth_date: string | null;
    health_concerns: string | null;
    species: "DOG" | "CAT";
    reg_num: string | null;
    neutered: "Y" | "N" | "UNKNOWN";
    weight_kg: string | number | null;
    fur_color: string | null;
    adoption_date: string | null;
}

/** DB 행 → 화면용 Pet */
function toPet(row: DbPetRow): Pet {
    return {
        id: row.pet_id,
        name: row.pet_name,
        photo_url: row.profile_photo_url,
        gender: row.gender === "MALE" ? "male" : "female",
        breed: row.breed,
        birth_date: row.birth_date,
        concerns: row.health_concerns ? row.health_concerns.split(",") : [],
        species: row.species === "CAT" ? "cat" : "dog",
        registration_number: row.reg_num,
        neuter: row.neutered === "Y" ? true : row.neutered === "N" ? false : null,
        weight: row.weight_kg ? String(row.weight_kg) : null,
        color: row.fur_color,
        adoption_date: row.adoption_date,
    };
}

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;
type SessionUser =
    | { ok: true; supabase: SupabaseServer; user: { id: string } }
    | { ok: false; failure: PetActionResult };

/** 로그인 사용자. 연결 실패와 로그인 안 됨을 구분합니다 */
async function getSessionUser(): Promise<SessionUser> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getUser();
        if (data.user) return { ok: true, supabase, user: data.user };
        // 네트워크 오류(AuthRetryableFetchError)는 로그인 문제가 아니라 연결 문제
        return { ok: false, failure: error?.name === "AuthRetryableFetchError" ? SERVER_ERROR : AUTH_ERROR };
    } catch (error) {
        console.error("Supabase client error:", error);
        return { ok: false, failure: SERVER_ERROR };
    }
}

/** 사진 주소는 우리 저장소(또는 이미지 허용 호스트)의 https 주소만 받습니다 */
function isAllowedPhotoUrl(url: string) {
    try {
        const u = new URL(url);
        if (u.protocol !== "https:") return false;
        const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;
        return u.hostname === supabaseHost || u.hostname === "images.unsplash.com";
    } catch {
        return false;
    }
}

const clip = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/** 입력값 검사 + DB 컬럼 값으로 바꾸기 */
function toDbValues(input: PetFormData): { ok: true; values: Record<string, unknown> } | { ok: false; error: string } {
    // 화면을 거치지 않은 조작 요청(객체가 아님, 날짜·번호·사진에 숫자 등)도 예외 없이 안내 문구로 돌려줍니다
    if (!input || typeof input !== "object") return { ok: false, error: "입력값을 다시 확인해 주세요" };
    for (const key of ["birth", "adoptionDate", "reg_number", "photo"] as const) {
        const value: unknown = input[key];
        if (value !== null && value !== undefined && typeof value !== "string") {
            return { ok: false, error: "입력값 형식이 올바르지 않아요. 다시 입력해 주세요" };
        }
    }

    const name = clip(input.name, 200);
    const nameError = petNameError(name);
    if (nameError) return { ok: false, error: nameError };
    if (input.species !== "dog" && input.species !== "cat") return { ok: false, error: "강아지인지 고양이인지 골라 주세요" };
    if (input.gender !== "male" && input.gender !== "female") return { ok: false, error: "성별을 골라 주세요" };

    // 서버는 UTC 로 돌아가므로 한국 날짜에 하루 여유를 둡니다 (화면에서는 기기 날짜로 이미 막습니다)
    const birth = input.birth || null;
    const adoptionDate = input.adoptionDate || null;
    const dateError = petDatesError({ birth, adoptionDate }, addDaysIso(todayIso("Asia/Seoul"), 1));
    if (dateError) return { ok: false, error: dateError };

    const weightText = input.weight === null || input.weight === undefined ? "" : String(input.weight).trim();
    const wError = weightError(weightText);
    if (wError) return { ok: false, error: `몸무게: ${wError}` };

    const regError = regNumberError(input.reg_number);
    if (regError) return { ok: false, error: regError };
    const regNumber = input.reg_number ? normalizeRegNumber(input.reg_number) || null : null;

    const photo = input.photo || null;
    if (photo && !isAllowedPhotoUrl(photo)) return { ok: false, error: "사진을 다시 올려 주세요" };

    const concerns = Array.isArray(input.concern) ? input.concern.filter((c) => typeof c === "string" && c).map((c) => c.slice(0, 30)).slice(0, 12) : [];

    return {
        ok: true,
        values: {
            pet_name: name,
            species: input.species === "cat" ? "CAT" : "DOG",
            breed: clip(input.breed, 50) || "믹스",
            gender: input.gender === "female" ? "FEMALE" : "MALE",
            // 체크하지 않은 경우는 "모름"
            neutered: input.neuter === true ? "Y" : input.neuter === false ? "N" : "UNKNOWN",
            birth_date: birth,
            adoption_date: adoptionDate,
            // decimal(4,2): 소수 둘째 자리까지
            weight_kg: weightText ? Math.round(Number(weightText) * 100) / 100 : null,
            fur_color: clip(input.color, 30) || null,
            health_concerns: concerns.length ? concerns.join(",") : null,
            profile_photo_url: photo,
            reg_status: regNumber ? "Y" : "N",
            reg_num: regNumber,
        },
    };
}

/** DB 오류 → 사용자 문구 */
function dbErrorResult(error: { code?: string; message?: string } | null | undefined): PetActionResult {
    if (error?.code === "23505") {
        return { success: false, code: "duplicate", error: "이미 등록된 동물등록번호예요. 번호를 다시 확인해 주세요." };
    }
    return SAVE_ERROR;
}

/** 내 정보 화면을 새로 그립니다 (홈의 "내 아이" 카드는 화면에서 바로 다시 불러옵니다) */
function revalidatePetScreens(petId?: string) {
    revalidatePath("/mypage");
    if (petId) revalidatePath(`/settings/pets/${petId}/edit`);
}

export async function getPet(petId: string) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) return null;

        const { data, error } = await supabase
            .from("pets")
            .select("*")
            .eq("pet_id", petId)
            .eq("user_id", user.id)
            .single();

        if (error || !data) return null;
        return toPet(data as DbPetRow);
    } catch (error) {
        console.error("Error fetching pet:", error);
        return null;
    }
}

export async function getPets() {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return [];
        }

        const { data, error } = await supabase
            .from("pets")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching pets:", error);
            return [];
        }

        return (data as DbPetRow[]).map(toPet);
    } catch (error) {
        console.error("Unexpected error in getPets:", error);
        return [];
    }
}

/**
 * 내 아이 목록 (화면의 usePets 용). getPets 와 달리 로그인하지 않았을 때만 [] 를 돌려주고,
 * 연결 실패·DB 오류는 예외로 알려 화면이 "아직 없어요" 대신 "불러오지 못했어요"를 보여 주게 합니다.
 */
export async function getMyPetsOrThrow(): Promise<Pet[]> {
    const session = await getSessionUser();
    if (!session.ok) {
        if (session.failure.success === false && session.failure.code === "auth") return [];
        throw new Error("pets_load_failed");
    }
    const { data, error } = await session.supabase
        .from("pets")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: true });
    if (error) {
        console.error("Error fetching pets:", error);
        throw new Error("pets_load_failed");
    }
    return (data as DbPetRow[]).map(toPet);
}

export async function createPet(formData: PetFormData): Promise<PetActionResult> {
    const session = await getSessionUser();
    if (!session.ok) return session.failure;

    try {
        const parsed = toDbValues(formData);
        if (!parsed.ok) return invalid(parsed.error);

        const { data: newPet, error } = await session.supabase
            .from("pets")
            .insert({ user_id: session.user.id, ...parsed.values })
            .select("pet_id")
            .single();

        if (error || !newPet) {
            console.error("Supabase insert error:", error);
            return dbErrorResult(error);
        }

        revalidatePetScreens();
        return { success: true, petId: newPet.pet_id };
    } catch (error) {
        console.error("Failed to create pet:", error);
        return SAVE_ERROR;
    }
}

export async function updatePet(petId: string, formData: PetFormData): Promise<PetActionResult> {
    const session = await getSessionUser();
    if (!session.ok) return session.failure;

    try {
        const parsed = toDbValues(formData);
        if (!parsed.ok) return invalid(parsed.error);

        const { data, error } = await session.supabase
            .from("pets")
            .update(parsed.values)
            .eq("pet_id", petId)
            .eq("user_id", session.user.id)
            .select("pet_id");

        if (error) {
            console.error("Supabase update error:", error);
            return dbErrorResult(error);
        }
        if (!data?.length) return { success: false, code: "invalid", error: "이 아이 정보를 찾을 수 없어요. 목록을 새로 고쳐 주세요." };

        revalidatePetScreens(petId);
        return { success: true, petId };
    } catch (error) {
        console.error("Failed to update pet:", error);
        return SAVE_ERROR;
    }
}

export async function deletePet(petId: string): Promise<PetActionResult> {
    const session = await getSessionUser();
    if (!session.ok) return session.failure;

    try {
        const { error } = await session.supabase
            .from("pets")
            .delete()
            .eq("pet_id", petId)
            .eq("user_id", session.user.id);

        if (error) {
            console.error("Supabase delete error:", error);
            return { success: false, code: "server", error: "삭제하지 못했어요. 잠시 후 다시 시도해 주세요." };
        }

        revalidatePetScreens(petId);
        return { success: true };
    } catch (error) {
        console.error("Failed to delete pet:", error);
        return { success: false, code: "server", error: "삭제하지 못했어요. 잠시 후 다시 시도해 주세요." };
    }
}
