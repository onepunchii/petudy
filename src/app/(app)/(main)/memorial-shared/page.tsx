"use client";

import { PawPrint } from "lucide-react";
import { APP_ICON_STROKE, AppBody, AppHero, AppLinkButton, appCardClass } from "@/components/app/ui";
import { cn } from "@/lib/utils";

interface DepartedPet {
    id: string;
    name: string;
    species: "dog" | "cat";
    passedDate: string;
    message: string;
    image?: string;
}

const departedPets: DepartedPet[] = [
    { id: "1", name: "두부", species: "dog", passedDate: "2026.03.28", message: "15년간 함께한 가장 소중한 가족이야. 언제까지 네 냄새가 나는 지 기억날게." },
    { id: "2", name: "모찌", species: "cat", passedDate: "2026.03.15", message: "창가에서 햇볕 쬐던 모습이 아직 눈앞에 보여. 사랑해 모찌야." },
    { id: "3", name: "콩이", species: "dog", passedDate: "2026.03.10", message: "산책 갈 때마다 좋아하던 그 공원에서 자주 만나고 있어. 고향으로 돌아간 콩이, 잘 지내니?" },
    { id: "4", name: "나비", species: "cat", passedDate: "2026.02.28", message: "내 무릎 위에 앉아서 가르던 그 온기가 세상에서 제일 따뜻했어." },
    { id: "5", name: "초코", species: "dog", passedDate: "2026.02.14", message: "볼 때마다 웃음이 나왔어. 항상 그렇게 순수하게 날 바라봐줘서 고마웠어." },
    { id: "6", name: "루나", species: "cat", passedDate: "2026.02.01", message: "달빛 아래에서 가장 아름답게 빛났던 고양이. 지금은 하늘에서 빛나고 있겠지." },
    { id: "7", name: "봄이", species: "dog", passedDate: "2026.01.25", message: "눈 올 때 제일 좋아했어. 이제는 하늘에서 눈을 내려보고 있겠지." },
    { id: "8", name: "뭉치", species: "dog", passedDate: "2026.01.18", message: "꼬리 흔드는 모습이 세상에서 제일 좋았어. 사랑해 뭉치야." },
    { id: "9", name: "키티", species: "cat", passedDate: "2026.01.05", message: "새벽마다 내 베개에 와 자던 게 얼마나 따뜻했는지. 키티야 잘 자." },
    { id: "10", name: "사랑", species: "dog", passedDate: "2025.12.20", message: "이름처럼 우리를 사랑해준 아이. 언제까지 기억할게." },
    { id: "11", name: "구름", species: "cat", passedDate: "2025.12.10", message: "창밖을 바라보던 모습이 아직 나에게 남아. 구름아 잘 자." },
    { id: "12", name: "해피", species: "dog", passedDate: "2025.11.28", message: "산책할 때 항상 앞서 뛰어가줬어. 해피는 항상 행복했으면 좋겠어." },
    { id: "13", name: "밀키", species: "cat", passedDate: "2025.11.15", message: "우유 찾는 소리가 아직 귀에 남아. 밀키는 내 딸이었어." },
    { id: "14", name: "바우", species: "dog", passedDate: "2025.11.01", message: "머리 쓰다듬어줄 때 늘 웃던 얼굴이 잊을 수가 없어." },
    { id: "15", name: "꽃이", species: "cat", passedDate: "2025.10.20", message: "책상 위에서 잠자던 모습이 제일 귀여웠어. 꽃이도 그렇게 편히 자." },
    { id: "16", name: "복숭아", species: "dog", passedDate: "2025.10.08", message: "복숭아처럼 달콤했던 당신이 보고 싶어요." },
    { id: "17", name: "안디", species: "cat", passedDate: "2025.09.25", message: "항상 내 옆에 있어줘서 고마웠어. 안디는 천사였어." },
    { id: "18", name: "찰스", species: "dog", passedDate: "2025.09.12", message: "뛰어다니는 게 너무 좋아했어. 이제는 구름 위에서 뛰고 있겠지." },
    { id: "19", name: "슈", species: "cat", passedDate: "2025.08.30", message: "당신의 눈동자가 세상에서 제일 예뻤어. 슈야 영원히 사랑해." },
    { id: "20", name: "브라운", species: "dog", passedDate: "2025.08.15", message: "갈색 털이 항상 따뜻했어. 브라운아 잘 자." },
    { id: "21", name: "제이미", species: "cat", passedDate: "2025.08.01", message: "네가 떠날 때 난 울지 않을 거야. 대신 매일 웃을게." },
    { id: "22", name: "쿠키", species: "dog", passedDate: "2025.07.20", message: "간식 달라고 눈으로 말할 때가 제일 귀여웠어." },
    { id: "23", name: "빈랑", species: "cat", passedDate: "2025.07.08", message: "네가 본 하늘이 더 넓었을 텐데. 빈랑아 꽃밭에서 자주 보자." },
    { id: "24", name: "토니", species: "dog", passedDate: "2025.06.25", message: "처음 데려왔던 그 날이 세상에서 제일 행복한 날이었어." },
    { id: "25", name: "시루", species: "dog", passedDate: "2025.06.12", message: "시루는 항상 순둥이였어. 근육이 아니라 마음이요." },
    { id: "26", name: "마녀", species: "cat", passedDate: "2025.05.30", message: "새벽에 울음소리 들려주는 게 얼마나 좋았어. 마녀야 고마웠어." },
];

export default function MemorialSharedPage() {
    return (
        <div className="min-h-full">
            <AppHero
                back="/app"
                title="별로간 아이들"
                subtitle={
                    <>
                        이 세상 모든 이별은
                        <br />
                        서로가 사랑했음을 증명해요
                    </>
                }
            />

            <AppBody>
                {/* 아이 사진 자리를 가는 선으로 이어 별자리처럼 보이게 합니다 */}
                <ol>
                    {departedPets.map((pet) => (
                        <li key={pet.id} className="group relative flex items-start gap-4 pb-4 last:pb-0">
                            <span className="absolute bottom-0 left-7 top-14 w-px -translate-x-1/2 bg-line group-last:hidden" aria-hidden />
                            <div
                                role={pet.image ? undefined : "img"}
                                aria-label={pet.image ? undefined : pet.species === "dog" ? "강아지" : "고양이"}
                                className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-pass text-ink-3 ring-1 ring-inset ring-line"
                            >
                                {pet.image ? (
                                    <img src={pet.image} alt={pet.name} className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    <PawPrint className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                )}
                            </div>
                            <div className={cn(appCardClass, "min-w-0 flex-1 p-5")}>
                                <div className="mb-1.5 flex items-baseline gap-2">
                                    <h3 className="text-[16px] font-bold text-ink">{pet.name}</h3>
                                    <span className="text-[13px] tabular-nums text-ink-3">{pet.passedDate}</span>
                                </div>
                                <p className="text-[14.5px] leading-[1.75] text-ink-2">&ldquo;{pet.message}&rdquo;</p>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="mt-8 rounded-[28px] bg-pine-soft px-6 py-8 text-center">
                    <p className="text-[16px] font-bold text-ink">포온은 함께했던 순간을 기억합니다</p>
                    <p className="mt-2 text-[13.5px] text-ink-2">더 많은 이야기는 추억상자에서 만나보세요</p>
                    <AppLinkButton href="/memorial" variant="primary" className="mt-5">
                        추억상자 가기
                    </AppLinkButton>
                </div>
            </AppBody>
        </div>
    );
}
