# 지훈 · 지형 모바일 청첩장

2027년 1월 2일 토요일 오후 3시 30분 · 웨스턴베니비스 영등포.

## 미리보기

`npm run dev` 실행 후 http://localhost:4173 에서 확인합니다. 별도 패키지 설치나 빌드가 필요 없습니다. 배포 디렉터리는 `dist/`입니다.

## GitHub Pages

GitHub Actions 배포 설정과 배포 주소 자동 반영 스크립트를 준비했습니다. 설정 순서와 파일 구성은 [GITHUB-PAGES.md](GITHUB-PAGES.md)를 참고하세요. GitHub Pages용 산출물은 `.artifacts/github-pages/`입니다.

- Pages: https://helloworld8001.github.io/wedding-invitation/
- GitHub: https://github.com/helloworld8001/wedding-invitation
- 업데이트: 변경 커밋 후 `git push github master`

## 청첩장 QR 코드

- 연결 주소: https://helloworld8001.github.io/wedding-invitation/
- [PNG 다운로드](dist/assets/invitation-qr.png), [인쇄용 SVG](dist/assets/invitation-qr.svg)
- 흰 배경·검정 코드, 사방 4모듈 여백, 오류 복원 수준 Q로 생성했습니다. 인쇄할 때 사방의 흰 여백을 유지하세요.
- QR에는 위 주소가 직접 들어 있습니다. 주소를 바꾸면 QR도 새로 생성해야 합니다.

## 구성

- 제공된 웨딩 사진, 우드·아이보리·샴페인 컬러, 한글 명조와 영문 세리프
- 초대 문구, 혼주 소개, 2027년 1월 달력, 한국 시간 기준 카운트다운
- 일정 파일 다운로드, 네이버/카카오 지도, 주소 복사, 네이티브 공유 및 링크 복사
- 반짝임 설정, 스크롤 등장 효과, 동작 줄이기 설정 지원
- 혼주 소개는 전병채·채명심의 장남 지훈, 유병우·박향순의 장녀 지형으로 표기합니다.
- 주차장으로 티맵·네이버 내비 앱 연결 및 카카오맵 길찾기를 제공합니다. Android는 앱 설치 페이지로의 대체 연결, iOS는 앱 설치 링크를 제공합니다. 휴대폰 실기기에서 앱 실행은 확인하지 않았습니다.

## 내비게이션 연결

차량 안내 목적지는 현대해상 강서사옥(당산로 141)입니다. 건물 중심 좌표 `37.52749, 126.89662`는 [Mapcarta / OpenStreetMap](https://mapcarta.com/W1222389479)을 사용하며, 주차장 입구의 정밀 좌표를 뜻하지 않습니다.

- [네이버 지도 URL Scheme](https://guide.ncloud-docs.com/docs/maps-url-scheme): `nmap://navigation`.
- [TMAP API 안내](https://openapi.sk.com/qnaCommunity/51), [앱 호출 관련 문의](https://openapi.sk.com/qnaCommunity/716): `tmap://route`의 `rGoName`, `rGoX`(경도), `rGoY`(위도).
- 카카오내비 직접 실행은 미연결입니다. [공식 SDK](https://developers.kakao.com/docs/ko/kakaonavi/js)의 JavaScript 키와 도메인 등록 또는 사용자가 제공한 목적지 공유 링크가 필요합니다. 현재 카카오 버튼은 명칭대로 카카오맵 길찾기를 엽니다.

## 수정 위치

- 문구·예식장·혼주: `dist/index.html`
- 디자인: `dist/style.css`
- 카운트다운·복사·공유: `dist/app.js`
- 캘린더 일정: `dist/wedding.ics`
- 메인 사진: `dist/assets/wedding.jpg`
- 갤러리 사진 10장 및 미리보기: `dist/assets/gallery/`
- 갤러리는 사진 확대, 좌우 스와이프, 방향키 탐색 및 Escape 닫기를 지원합니다. 원본을 보존하고 웹용 사진은 메타데이터를 제외해 별도로 생성합니다.

## 공유 미리보기

- 공유 대표 이미지는 웨딩 사진인 `dist/assets/share-photo-20261115.jpg`(1280×1920)입니다. 짧은 제목과 날짜·시간, 예식장·주소 순서의 설명을 OG 메타정보로 제공합니다. 실제 줄 수와 사진 자르기는 카카오톡 표시 방식에 따릅니다.
- 공유 본문은 날짜·시간·장소·주소를 항목별로 줄바꿈합니다. 하단의 ‘카카오톡 안내문 복사’로 안내문과 링크를 함께 복사할 수 있습니다.
- `scripts/prepare-github-pages.mjs`가 실제 Pages 주소에 맞춰 OG URL과 이미지 URL을 설정합니다.
- 공유·링크 복사는 `?v=20261115-4`를 포함합니다. 대표 이미지 파일명도 새로 지정해 이전 캐시의 영향을 줄였습니다.
- 이미 공유된 카드나 같은 URL에 예전 미리보기가 남으면 [카카오 URL 메타정보 관리](https://developers.kakao.com/tool/debugger/sharing)에서 캐시를 초기화할 수 있습니다. 카카오톡 실제 전송 화면은 별도로 확인해야 합니다.

## 폰트와 첫 화면 로딩

- Noto Serif KR, Noto Sans KR, Cormorant Garamond를 `dist/assets/fonts/`에서 WOFF2로 제공합니다. 한글은 400–500 가변 굵기, 영문은 400 일반체·이탤릭체를 사용합니다. 라이선스 파일을 함께 포함합니다.
- 첫 화면에서 쓰는 폰트 4개와 메인 사진을 프리로드하며, `font-display: swap`으로 폰트 로딩 중에도 글자를 표시합니다. 갤러리와 지도는 지연 로딩합니다.
- 폰트에는 HTML·JavaScript·CSS에 쓰인 글자와 모든 숫자·ASCII 문자를 포함합니다. 문구를 수정할 때 `npm run prepare:fonts`를 실행하고 생성된 폰트·`fonts.css`·`index.html`을 함께 커밋하세요. 이 명령은 Google Fonts에 접속하며, 사이트 이용과 Pages 빌드에는 폰트 다운로드가 필요하지 않습니다.

홀 이름, 층수, 개인 연락처는 제공되지 않아 표시하지 않았습니다. 신랑·신부 카카오뱅크 계좌는 사용자가 제공한 정보로 마음 전하실 곳에 표시하며, 펼쳐보기와 계좌번호 복사를 지원합니다. 추가 시 실제 정보를 사용하세요. 공유 미리보기의 URL과 이미지는 배포 도메인이 바뀌면 수정해야 합니다. 로컬 미리보기 주소는 다른 기기에서 사용할 수 없습니다. Sites 공개 배포로 전환해 링크가 있는 하객은 로그인 없이 볼 수 있습니다.

참고: [예식장 공식 안내](https://ydp.thebennevis.co.kr/), [바른손 모바일청첩장](https://www.barunsonmcard.com/Product/List/1/18/1/0/2_/0). 예식장 주소 및 영등포구청역 3번 출구 약 200m 안내는 2026-10-09 공식 사이트 검색 결과로 확인했습니다. 오시는 길에는 카카오맵에서 생성한 공식 지도 퍼가기 코드를 `dist/venue-map.html`에 삽입했습니다. 확대·축소·이동이 가능하며, 외부 지도 서비스 연결이 필요합니다. 직접 그린 약도는 화면에서 제거했습니다. 원본은 `dist/assets/venue-directions.pdf`로 제공하며, 지하철·버스·주차 정보는 사용자 안내를 반영했습니다. 주차장은 당산로 141 현대해상 강서사옥 지하, 2시간 무료입니다. 예식 시간은 오후 3시 30분으로 본문·공유 문구·카운트다운·캘린더 파일에 반영했습니다.
