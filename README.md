# TCHAIKOP 전략 IP연구소 — 4페이지 웹사이트

## 시작하기
1. ZIP 압축을 푼다.
2. VS Code에서 `tchaikop-ip-lab` 폴더를 연다.
3. `index.html`을 우클릭하고 **Open with Live Server**를 누른다.
4. 메뉴에서 연구노트 → 글쓰기 → 저장 → 글 보기로 이동한다.

## 파일 설명
- `index.html`: 메인/히어로 영상/연구 분야/성과
- `board.html`: 게시글 목록/검색/분야별 필터
- `write.html`: 글쓰기와 수정
- `view.html`: 글 내용보기와 삭제
- `css/style.css`: 모든 페이지의 디자인, 고정 헤더, 반응형
- `js/common.js`: 모바일 메뉴
- `js/data.js`: 게시판 예시 글
- `js/board.js`: 게시판 작동과 브라우저 저장
- `assets/research-loop.mp4`: 자체 제작 추상 연구 영상
- `assets/hero-poster.jpg`: 영상 표지

## 주요 수정 지점
- 색상: `css/style.css` 맨 위 `:root`
- 연구 분야: `index.html`에서 `id="research"` 검색
- 성과: `index.html`에서 `id="outcomes"` 검색
- 게시판 예시 글: `js/data.js`

## 중요
이 버전은 HTML/CSS/JS만 쓰는 프런트엔드 연습용이야. 게시글은 localStorage에 저장되므로 다른 사람이나 기기에서 보이지 않아. 방문자 공동 게시판에는 데이터베이스, 인증, 서버가 필요해.

ETRI는 벤치마킹 대상이며 공식 제휴 관계가 없어. 특허출원은 등록 또는 상용화 성공을 의미하지 않아.

참고: https://www.etri.re.kr/korcon/sub8/sub8_01.etri
