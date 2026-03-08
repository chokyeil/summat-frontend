# FRONTEND_RULES.md (Summat Frontend Contract)

## 1) 목표
- 숨맛 프론트는 포트폴리오 + 실제 배포를 전제로 한다.
- 초기에는 SPA로 개발하고, 확장 가능한 구조를 유지한다.

## 2) 스택 고정
- Vite + React + TypeScript
- react-router-dom (SPA Routing)
- axios (HTTP)
- 환경변수: VITE_API_BASE_URL 사용 (baseURL 하드코딩 금지)

금지:
- fetch 직접 사용 금지 (axios만)
- 컴포넌트에서 API 호출 금지 (api 레이어만)
- any 남발 금지

## 3) 폴더 구조
src/
- api/       : axios 인스턴스 + 도메인별 API 함수
- types/     : ApiResponse 및 DTO 타입 정의
- routes/    : Router/Guards
- pages/     : Route 단위 화면
- components/: 재사용 컴포넌트
- utils/     : 공통 유틸
- hooks/     : 커스텀 훅(선택)

원칙:
- pages는 “조합/상태 연결”
- api는 “요청/응답 처리”
- components는 “UI 재사용”
- 타입은 types에 정의

## 4) ApiResponse 공통 처리
- 백엔드 응답은 ResponseEntity<ApiResponse> 래퍼 구조다.
- ApiResponse는 제네릭이 아니며, data는 Object로 내려온다.
- 프론트에서 ApiResponse 타입을 정의하고,
  공통 unwrap/에러처리 유틸을 만든다.
- 응답 구조는 실제 응답/코드로 확인 후 정확히 맞춘다(추측 금지).

## 5) 인증/권한
- accessToken은 localStorage에 저장 (key: accessToken)
- axios request interceptor로 Authorization: Bearer 자동 첨부
- 토큰 없으면 보호 라우트에서 /login으로 이동
- 관리자 라우트는 최소 가드 적용(가능하면 role 기반, 어려우면 401/403 처리 기반)

## 6) 반응형 규칙
- 모바일 우선(Mobile First)
- 브레이크포인트 기준:
  - Mobile: <640px
  - Tablet: 640~1024px
  - Laptop: 1024~1280px
  - Desktop: >1280px
- MVP 단계 CSS는 최소. 다만 semantic 구조 + className은 유지해서 나중에 스타일 입히기 쉽게 만든다.

## 7) 파일 업로드(FormData) 규칙 (장소 등록/수정 이미지)
- 파일 업로드는 반드시 FormData 사용
- 텍스트 필드도 FormData.append로 전송
- image 키는 "image"로 통일
- 가능하면 Content-Type은 axios가 자동 설정하도록 두고 강제 지정은 최소화
- 이미지 프리뷰는 URL.createObjectURL(file)로 MVP 구현

## 8) 에러/로딩 규칙
- Loading/Error UI는 공통 컴포넌트 사용
- 401/403은 안내 메시지 + 필요 시 /login 이동
- API 실패 메시지는 ApiResponse의 message/code 기반으로 표시

## 9) CORS 운영 원칙
- 개발: localhost:5173 → localhost:8080 CORS 필요
- 운영: 배포 도메인으로 allowedOrigins 조정 필요

## 10) UI 구조 규칙 (MVP 단계)

- 숨맛 프론트는 웹/모바일을 분리하지 않고 **하나의 SPA + 반응형 구조**로 구현한다.
- 모바일/태블릿/노트북/PC 모두 동일한 **정보 구조(IA)** 를 유지한다.
- 화면 크기에 따라 **레이아웃만 변경**한다.
- MVP 단계에서는 완성형 디자인보다 **UI 검증 속도**를 우선한다.
- HTML/CSS 시안이 있을 경우 그대로 복붙하지 말고 **React 컴포넌트 구조로 분리**해서 적용한다.

기본 UI 흐름:

홈 → 장소 카드 리스트 → 장소 상세 → 댓글/좋아요


## 11) 컴포넌트 분리 규칙

홈 화면 UI는 다음 단위를 기준으로 분리한다.

- Header
- SearchBar
- CategoryTabs
- RegionFilterChips
- TagFilterChips
- PlaceCard
- PlaceCardList
- BottomNavigation

원칙:

- pages는 화면 구성/상태 연결 담당
- components는 UI 재사용 담당
- 과도한 분리는 지양
- 카드/필터/네비는 반드시 컴포넌트화


## 12) 반응형 UI 규칙

모바일 우선(Mobile First)

카드 그리드 규칙:

- Mobile (<640px) : 1열 카드
- Tablet (640~1024px) : 2열 카드
- Laptop (1024~1280px) : 3열 카드
- Desktop (>1280px) : 4열 카드

모바일에서는 하단 네비게이션을 사용한다.

웹에서는 상단 헤더 중심 구조를 사용한다.


## 13) 디자인 방향

숨맛은 **장소 탐색 서비스**다.

참고 UX:

- Instagram : 피드 흐름
- 오늘의집 : 카드 정돈감
- 당근마켓 : 생활형 서비스 느낌

디자인 원칙:

- 카드 중심 UI
- 이미지 중심
- 태그 가독성 강조
- 과한 애니메이션 금지
- 과한 shadow 금지
- 간결한 여백 구조


## 14) 데이터 상수 규칙

카테고리/태그/지역 값은 임의로 생성하지 않는다.

반드시 다음 기준을 따른다.

- 백엔드 enum
- 프로젝트 constants
- API 응답

특히 PlaceTagType은 다음 규칙을 따른다.

- label이 아니라 **code 값 사용**
- 예: wifi, socket, parking

추측 기반 필드 생성 금지.


## 15) UI 적용 작업 방식

정적 HTML/CSS 시안 적용 시:

1. React 컴포넌트 구조로 분리
2. 더미 데이터로 UI 먼저 확인
3. API 연동은 이후 단계

적용 순서:

1. 홈 화면
2. PlaceCard
3. 장소 상세
4. 등록 화면
5. 마이페이지

한 번에 모든 화면을 구현하지 않는다.

## 16) 기존 구조 존중

UI 적용 시 기존 프로젝트 구조를 최대한 유지한다.

- 기존 Router 구조 변경 금지
- 기존 상태 관리 변경 금지
- 기존 API 레이어 구조 변경 금지

UI 변경은 가능하지만
아키텍처 변경은 반드시 명시적 요청이 있을 때만 수행한다.