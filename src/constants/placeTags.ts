export const PLACE_TAGS = [
  { code: "wifi", label: "와이파이" },
  { code: "socket", label: "콘센트" },
  { code: "parking", label: "주차가능" },
  { code: "pet", label: "반려동물동반" },
  { code: "kids", label: "키즈존" },
  { code: "mood", label: "감성카페" },
  { code: "book", label: "북카페" },
  { code: "work", label: "작업하기좋은" },
  { code: "quiet", label: "조용한카페" },
  { code: "brunch", label: "브런치" },
  { code: "bakery", label: "빵집" },
  { code: "dessert", label: "디저트맛집" },
  { code: "view", label: "뷰맛집" },
  { code: "photo", label: "포토존" },
  { code: "terrace", label: "테라스" },
] as const;

export type PlaceTagCode = typeof PLACE_TAGS[number]["code"];
