"use client";

import { ArrowUpRight, ClipboardList, Phone, Plus, ReceiptText, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Pet } from "@/actions/pet";
import { APP_ICON_STROKE, AppBody, AppHero, AppList, AppListItem, AppSection, BRAND_ICON, BrandIcon, appCardClass } from "@/components/app/ui";
import PetSelectionSheet from "@/components/shared/PetSelectionSheet";
import { Logo } from "@/components/site/SiteHeader";
import { usePets } from "@/hooks/usePets";
import { SITE } from "@/lib/site/config";
import { cn } from "@/lib/utils";

const CURRENT_PET_KEY = "foon_current_pet_id";

function readStoredPetId(): string | null {
	try {
		return localStorage.getItem(CURRENT_PET_KEY);
	} catch {
		return null;
	}
}

/**
 * 앱 홈 (기준 화면). 사이트 장례 페이지와 같은 구성: 위쪽 밤 히어로 -> 달빛 본문.
 * 장례 영역은 그림과 흰/남색만, "함께 사는 동안" 영역은 3D 클레이 아이콘을 씁니다.
 */
export default function HomePageClient() {
	const { data: initialPets = [] } = usePets();
	const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	// 펫 목록은 클라이언트에서만 채워지므로(서버 prefetch 없음) 여기서 localStorage 를 읽어도 안전합니다.
	const currentPet = useMemo<Pet | null>(() => {
		if (initialPets.length === 0) return null;
		const id = selectedPetId ?? readStoredPetId();
		return initialPets.find((p: Pet) => p.id === id) ?? initialPets[0];
	}, [initialPets, selectedPetId]);

	const handleSelectPet = (pet: Pet) => {
		setSelectedPetId(pet.id);
		try {
			localStorage.setItem(CURRENT_PET_KEY, pet.id);
		} catch {
			// 저장소 접근 불가(사생활 보호 모드 등) — 선택은 이번 세션에만 유지
		}
	};

	const petName = currentPet ? currentPet.name : null;
	const petPhoto = currentPet ? currentPet.photo_url : null;

	return (
		<div className="min-h-full bg-moon">
			<AppHero
				top={
					<>
						<Logo />
						<Link
							href="/"
							className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-[13px] font-semibold text-star-2 ring-1 ring-inset ring-white/15 transition-colors hover:text-star"
						>
							포온 홈페이지
							<ArrowUpRight className="h-3.5 w-3.5" strokeWidth={APP_ICON_STROKE} aria-hidden />
						</Link>
					</>
				}
				title={
					<>
						{petName ?? "예비"} 보호자님,
						<br />
						반가워요
					</>
				}
				subtitle="함께하는 날은 기록하고, 필요한 곳은 가까이에서 찾아 드려요"
				action={
					<button
						type="button"
						onClick={() => setIsSheetOpen(true)}
						aria-label="아이 선택"
						className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-night-3 ring-1 ring-white/10 transition-transform active:scale-95"
					>
						<span className="absolute inset-0 overflow-hidden rounded-2xl">
							{petPhoto ? (
								<Image src={petPhoto} alt={`${petName} 사진`} fill sizes="56px" className="object-cover" />
							) : (
								<span className="flex h-full w-full items-center justify-center text-star-3">
									<User className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
								</span>
							)}
						</span>
						<span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-lime text-ink ring-2 ring-night">
							<Plus className="h-3 w-3" strokeWidth={3} aria-hidden />
						</span>
					</button>
				}
			/>

			<AppBody className="pt-6">
				{/* 떠나는 날: 그림 + 흰/남색만 (라임·캐릭터 없음) */}
				<AppSection>
					<Link href="/funeral" className="group relative block overflow-hidden rounded-[28px] bg-night">
						<div className="relative aspect-[16/10]">
							<Image
								src="/brand/hero/funeral.webp"
								alt=""
								fill
								sizes="(max-width: 512px) 100vw, 480px"
								className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
								style={{ objectPosition: "50% 40%" }}
							/>
						</div>
						<div className="absolute inset-0 bg-gradient-to-t from-night via-night/25 to-transparent" aria-hidden />
						<div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
							<div>
								<h2 className="text-[21px] font-bold text-star">
									반려동물 장례
									<span className="sr-only">(포온 홈페이지로 이동)</span>
								</h2>
								<p className="mt-1 text-[14px] leading-snug text-star-2">가장 가까운 허가 장례식장으로 연결해요</p>
							</div>
							<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-star ring-1 ring-inset ring-white/20" aria-hidden>
								<ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} />
							</span>
						</div>
					</Link>

					<AppList className="mt-3" aria-label="장례 안내">
						<AppListItem
							href="/guide/pet-funeral-cost"
							icon={<ReceiptText className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />}
							label="장례 비용 알아보기"
							detail="체중별 기본 비용과 추가 항목"
						/>
						<AppListItem
							href="/guide/pet-death-first-steps"
							icon={<ClipboardList className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />}
							label="아이가 떠난 직후 할 일"
							detail="몸 정리, 안치, 장례 방법 고르기"
						/>
						<AppListItem
							href={SITE.phoneHref}
							external
							icon={<Phone className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />}
							label="전화 상담"
							detail={<span className="tabular-nums">24시간 {SITE.phone}</span>}
						/>
					</AppList>
				</AppSection>

				{/* 함께 사는 동안: 3D 클레이 아이콘 */}
				<AppSection title="함께 사는 동안" id="home-life">
					<div className="grid grid-cols-2 gap-3">
						<Link href="/consult" className={cn(appCardClass, "row-span-2 flex flex-col justify-between p-5 transition-transform active:translate-y-px")}>
							<BrandIcon src={BRAND_ICON.ai} size={96} className="mx-auto mt-2" />
							<span className="mt-6 block">
								<span className="block text-[18px] font-bold leading-snug text-ink">포온 AI 도우미</span>
								<span className="mt-1 block text-[13.5px] leading-snug text-ink-2">궁금한 건 언제든 물어보세요</span>
							</span>
						</Link>
						<Link href="/mbti" className={cn(appCardClass, "flex flex-col gap-3 p-4 transition-transform active:translate-y-px")}>
							<BrandIcon src={BRAND_ICON.mbti} size={48} />
							<span className="block">
								<span className="block text-[16px] font-bold text-ink">펫 MBTI</span>
								<span className="mt-0.5 block text-[12.5px] text-ink-3">우리 아이 성격 알아보기</span>
							</span>
						</Link>
						<Link href="/grooming" className={cn(appCardClass, "flex flex-col gap-3 p-4 transition-transform active:translate-y-px")}>
							<BrandIcon src={BRAND_ICON.grooming} size={48} />
							<span className="block">
								<span className="block text-[16px] font-bold text-ink">
									가까운 애견미용
									<span className="sr-only">(포온 홈페이지로 이동)</span>
								</span>
								<span className="mt-0.5 block text-[12.5px] text-ink-3">산책길에서 가까운 곳</span>
							</span>
						</Link>
					</div>
				</AppSection>

				<p className="mt-8 text-center text-[13px] text-ink-3">
					찾는 업체가 따로 있으신가요?{" "}
					<Link href="/area" className="font-semibold text-pine underline-offset-4 hover:underline">
						우리 동네 찾기
					</Link>
				</p>
			</AppBody>

			<PetSelectionSheet
				isOpen={isSheetOpen}
				onClose={() => setIsSheetOpen(false)}
				currentPetId={currentPet?.id || null}
				pets={initialPets}
				onSelectPet={handleSelectPet}
			/>
		</div>
	);
}
