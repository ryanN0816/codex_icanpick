# 골라줘

고민의 제목과 선택지 2~8개를 입력하면 동일한 확률로 하나를 골라주는 모바일 웹 앱입니다. React + Vite로 만들었으며 앱인토스 Web Framework 3.8 설정을 포함합니다. 외부 AI API나 서버 없이 동작합니다.

## 개발

Node.js 24 이상을 사용합니다.

```sh
npm ci
npm run dev
```

이 클라우드 환경에서 npm 캐시 경로가 필요하면 `npm --cache /workspace/.npm-cache ci`를 사용하세요.

## 기능

- 선택지 입력·추가·삭제 및 무작위 선택
- 점심, 커피, 주말, 영화 템플릿
- 최근 20개 선택 기록의 기기 내 저장 및 삭제
- 작성 중인 선택지 자동 저장·복원 및 새로운 고민 시작
- 결과 확정 카드, 결과 창의 키보드 이동·초점 복원
- 데스크톱·모바일 반응형 UI와 키보드로 조작 가능한 결과 창

## 검증

```sh
npm test
npm run build
npm run test:e2e
```

브라우저가 없는 환경에서는 먼저 `npx playwright install chromium`을 실행하세요. 이 클라우드 환경은 시스템 Chromium을 사용할 수 있습니다.

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

## 앱인토스

```sh
npm run toss:build
```

`icanpick.ait`를 생성합니다. `apps-in-toss.config.ts`의 `appName`은 현재 개발용 이름이므로 앱인토스 콘솔에 등록한 실제 앱 이름과 맞춰야 합니다. 브라우저 개발은 `npm run toss:dev`로 실행합니다. 개발용 SDK 도구는 Vite 플러그인에 연결되어 있으며 운영 번들에는 포함되지 않습니다.

실제 출시 전 앱인토스 콘솔 등록, 앱 아이콘과 서비스 정보 설정, 정책·디자인 가이드 검토, 토스 앱 내 실기기 테스트, 배포·심사가 필요합니다. 현재 토스 앱 내부 동작과 심사 통과는 검증하지 않았고 배포도 진행하지 않았습니다. 현재 선택 기능은 개인화 추천이 아닌 무작위 추첨입니다. 기록은 브라우저의 localStorage에 저장되므로 기기 간 동기화하지 않습니다.

출시 준비 항목과 서비스 소개 초안은 [앱인토스 출시 준비](docs/RELEASE.md)에 정리했습니다.

콘솔 등록 전 필요한 소개 문구와 아이콘은 [콘솔 등록 자료](docs/CONSOLE.md)를 참고하세요. 앱 하단의 ‘앱·개인정보 안내’에서 데이터 보관 방식을 확인하고 초안·기록을 함께 삭제할 수 있습니다.

## AIT 파일 다운로드

[빌드된 icanpick.ait 받기](https://github.com/ryanN0816/codex_icanpick/raw/refs/heads/main/downloads/icanpick.ait)

직접 빌드하려면 Node.js 24 이상을 설치한 PC에서 아래 명령을 실행하세요.

```sh
git clone https://github.com/ryanN0816/codex_icanpick.git
cd codex_icanpick
npm ci
npm run toss:build
```

프로젝트 폴더에 `icanpick.ait`가 생성됩니다.
