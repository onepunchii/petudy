import { wideOg } from "@/lib/site/og";

/*
 * 부고장 링크를 가족·지인 단톡방에 붙였을 때의 미리보기.
 * 상위 (main) 의 앱 소개 카드(라임 '예약하기' 알약)를 물려받지 않도록 이 경로에서 차분한 카드로 바꿉니다.
 * 부고 내용은 공개 링크를 연 사람만 보도록 그림에는 아이 이름·날짜를 넣지 않습니다(DB 조회 없음).
 */
export const alt = "포온 부고장. 먼저 떠난 아이의 소식";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return wideOg({
        kicker: "부고장",
        title: "먼저 떠난 아이의 소식을 전합니다",
        passLabel: "보낸 곳",
        passValue: "포온 부고장",
        passNote: "링크를 열면 소식을 볼 수 있어요",
        stubLabel: "포온",
        stubValue: "po-on",
        seed: "/memorial/obituary",
    });
}
