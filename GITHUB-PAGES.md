# GitHub Pages 배포

## 연결된 저장소

- 저장소: https://github.com/helloworld8001/wedding-invitation
- Pages 주소: https://helloworld8001.github.io/wedding-invitation/
- 배포 기록: https://github.com/helloworld8001/wedding-invitation/actions
- Git 원격 이름: `github`, 기본 브랜치: `master`
- 인증: GitHub CLI(`gh`), Pages 배포 방식: GitHub Actions

변경을 커밋한 뒤 `git push github master`로 올리면 사이트 파일 변경에 대해 자동 배포됩니다.

## 준비된 내용

- `.github/workflows/deploy-pages.yml`: 기본 브랜치(main 또는 master)에 사이트 변경을 올리면 배포합니다. Actions 화면에서 수동 실행도 가능합니다.
- `scripts/prepare-github-pages.mjs`: GitHub가 알려주는 실제 배포 주소로 공유 미리보기의 페이지·사진 URL을 설정합니다. 저장소 하위 경로와 커스텀 도메인을 지원합니다.
- `dist/app.js`: 공유·링크 복사·네이버 내비 식별 URL에 저장소 경로를 유지합니다.
- 배포 산출물은 `.artifacts/github-pages/`입니다. 서버 실행이나 패키지 설치, 외부 데이터베이스가 필요 없습니다.

## 배포 순서

1. 사용할 GitHub 저장소를 만듭니다. 사진을 포함한 이 프로젝트 파일을 올립니다. 아래 파일과 폴더가 반드시 포함되어야 합니다.

   ```text
   .github/workflows/deploy-pages.yml
   scripts/prepare-github-pages.mjs
   package.json
   dist/                         # assets 사진 폴더까지 포함
   ```

2. 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
3. 기본 브랜치를 `main` 또는 `master`로 둡니다. 다른 이름을 쓰면 workflow의 `branches`도 바꿉니다.
4. **Actions → Deploy invitation to GitHub Pages → Run workflow**에서 기본 브랜치를 선택해 실행합니다. 이후 사이트 파일을 push하면 자동 배포됩니다.
5. 성공한 실행의 `github-pages` 환경 링크에서 사이트를 엽니다. 주소는 일반적으로 `https://계정.github.io/저장소명/`이며, 최종 주소는 Pages 설정에서 확인합니다.

GitHub는 `github` remote로 연결했습니다. 기존 Sites의 호스팅 설정은 `.openai/hosting.json`에 유지되어 있습니다.

## 로컬에서 배포 파일 만들기

Node.js 22를 사용합니다. 아래 예시 URL을 실제 Pages 주소로 바꿉니다.

```sh
npm run build:pages -- https://USERNAME.github.io/REPOSITORY/
```

원본 `dist/index.html`의 기존 공개 사이트 메타데이터는 유지하고, GitHub Pages용 복사본에만 새 주소를 적용합니다. `.artifacts/`는 Git에 포함되지 않습니다. 로컬 미리보기는 기존대로 `npm run dev`입니다.

## 배포 후 확인할 내용

- 메인 사진과 갤러리 확대, 카카오 지도, 일정 다운로드
- 공유·링크 복사의 주소에 `/저장소명/`이 포함되는지
- 휴대폰에서 티맵·네이버 내비 연결
- 카카오톡 공유 미리보기의 사진과 예식 시간

외부 폰트와 카카오 지도는 해당 서비스에서 불러옵니다. 카카오내비 직접 실행은 아직 연결되지 않았으며, 향후 SDK로 연결하면 GitHub Pages의 실제 도메인도 Kakao 개발자 설정에 등록해야 합니다.

GitHub 원격 연결과 Pages 활성화를 마쳤습니다. 실제 배포 진행 상태는 위 배포 기록에서 확인할 수 있습니다.

참고: [GitHub 공식 Pages 배포 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [공식 정적 사이트 workflow](https://github.com/actions/starter-workflows/blob/main/pages/static.yml).
