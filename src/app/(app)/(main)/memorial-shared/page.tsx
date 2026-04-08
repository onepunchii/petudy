"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

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
        <div className="min-h-screen bg-[#0A0A0B]">
            <header className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                <Link href="/" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                    <span className="text-lg">🌸</span>
                    <h1 className="text-lg font-bold text-white">별로간 아이들</h1>
                </div>
            </header>

            <main className="p-4 max-w-[480px] mx-auto">
                <div className="text-center mb-8 pt-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foon-lime/10 flex items-center justify-center">
                        <span className="text-4xl">🌸</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        이 세상 모든 이별은<br />
                        서로가 사랑했음을 증명해요
                    </p>
                </div>

                <div className="space-y-4">
                    {departedPets.map((pet) => (
                        <div
                            key={pet.id}
                            className="bg-[#1e1e20] rounded-2xl p-5 border border-white/5"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-foon-lime/20 to-amber-500/20 flex items-center justify-center flex-shrink-0">
                                    {pet.image ? (
                                        <img src={pet.image} alt={pet.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <span className="text-2xl">{pet.species === "dog" ? "🐕" : "🐈"}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-white font-bold">{pet.name}</h3>
                                        <span className="text-xs text-gray-500">{pet.passedDate}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed italic">
                                        "{pet.message}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-b from-foon-lime/5 to-transparent rounded-2xl text-center">
                    <p className="text-foon-lime font-medium mb-2">포온은 함께했던 순간을 기억합니다</p>
                    <p className="text-gray-500 text-xs">
                        더 많은 이야기는 추억상자에서 만나보세요
                    </p>
                    <Link
                        href="/memorial"
                        className="inline-block mt-4 px-6 py-2.5 bg-foon-lime text-[#0A0A0B] rounded-full text-sm font-medium"
                    >
                        추억상자 가기
                    </Link>
                </div>
            </main>
        </div>
    );
}
