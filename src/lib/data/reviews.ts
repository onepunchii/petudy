export interface Review {
    id: string;
    name: string;
    rating: number;
    content: string;
    petType?: string;
    serviceType: string;
}

export const reviews: Review[] = [
    {
        id: "1",
        name: "김지수",
        rating: 5,
        content: "두부가 떠난 후 너무 허전했는데, 편지 기능으로 마음을 전하면서 많이 위로받았어요. 생전에 못다한 말들을 이제라도 전할 수 있어서 감사해요.",
        petType: "강아지",
        serviceType: "장례",
    },
    {
        id: "2",
        name: "박민수",
        rating: 5,
        content: "부고장 링크를 가족에게 보내니 바로 확인했어요. 아무리 말로 설명해都无法 다 표현했는데, 링크 하나로 다传达됐어요.",
        petType: "고양이",
        serviceType: "장례",
    },
    {
        id: "3",
        name: "이정화",
        rating: 5,
        content: "추억 사진 갤러리가 정말 좋아요. 올렸던 사진들이 마음처럼 정리되어 있어서, 보고 싶을 때마다 찾을 수 있어요.",
        petType: "강아지",
        serviceType: "추모",
    },
    {
        id: "4",
        name: "최준호",
        rating: 5,
        content: "장례식 진행이 너무 차분하고 아름다웠어요. 마지막 순간을 아이가 편안하게 보낼 수 있도록 배려해준 점이 정말 감사했어요.",
        petType: "강아지",
        serviceType: "장례",
    },
    {
        id: "5",
        name: "한서윤",
        rating: 5,
        content: "생일 때마다 편지를 쓰는데, 그때그때 감정이 남아있어서 나중에 다시 읽으면 정말 울컥해요. 소중한 추억이에요.",
        petType: "고양이",
        serviceType: "기념일",
    },
    {
        id: "6",
        name: "정다운",
        rating: 5,
        content: "추모 서비스를 이용했는데, 조문도整洁하고 분향소 분위기도 따뜻했어요. 주변에 추천했더니 다들 만족해했어요.",
        petType: "강아지",
        serviceType: "장례",
    },
];

export function getRandomReviews(count: number = 3): Review[] {
    const shuffled = [...reviews].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
