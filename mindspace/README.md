# 🌿 마음공간 (MindSpace)

> **마음대로 안 되는 일들이 있을 때, 혼자서 버티지 않아도 되도록.**

AI 기반 감정 케어 오픈소스 프로젝트 · 공익 목적 · MIT License

---

## 📋 공익적 목적 선언 (Public Purpose Statement)

이 소프트웨어는 **공익적 목적(Public Benefit Purpose)** 으로 개발되고 배포됩니다.

다음의 목적을 위해 이 프로젝트를 운영합니다:

- 🏥 **접근성 향상** — 정신건강 자원에 대한 경제적·사회적 장벽 없이 누구나 감정 지원을 받을 수 있도록 합니다.
- 🤝 **윤리적 AI 활용** — AI 기술을 인간의 정서적 안녕을 위해 사용하는 모범 사례를 제시합니다.
- 🌍 **오픈소스 공개** — 감정 케어 도구를 공개하여 전 세계 개발자·연구자가 자유롭게 개선하고 활용할 수 있게 합니다.
- 👥 **취약 계층 지원** — 청소년, 독거 노인, 이주민 등 감정 지원 공백이 큰 계층을 기술로 보완합니다.

> ⚠️ **이 서비스는 전문 정신건강 상담을 대체하지 않습니다.**  
> 심각한 위기 상황에는 반드시 전문가의 도움을 받으세요.  
> 🆘 자살예방상담전화: **1393** · 정신건강 위기상담: **1577-0199**

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 💬 **AI 공감 대화** | 선택한 감정 상태에 맞게 Claude AI가 판단 없이 경청하고 공감합니다 |
| 🌿 **호흡 가이드** | 4-4-6-2 박스 브리딩으로 자율신경계를 진정시킵니다 |
| 📖 **감정 일기** | 자유롭게 기록하면 AI가 공감적 인사이트를 제공합니다 |
| 🌸 **위로 카드** | 매일 바뀌는 따뜻한 응원 메시지를 전달합니다 |

---

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/mindspace.git
cd mindspace
```

### 2. API 키 설정

**방법 A — 로컬 테스트 (간단)**

`index.html` 의 `<head>` 안에 아래를 추가하세요:

```html
<script>
  window.ANTHROPIC_API_KEY = 'sk-ant-여기에키입력';
</script>
```

**방법 B — 서버 프록시 (권장 · 프로덕션)**

API 키를 브라우저에 노출하지 않으려면 백엔드 프록시를 사용하세요.  
`app.js`의 `CONFIG.apiUrl`을 자신의 서버 엔드포인트로 변경하면 됩니다.

```js
// app.js
const CONFIG = {
  apiUrl: 'https://your-server.com/api/chat',  // 프록시 서버
  ...
};
```

### 3. 실행

별도의 빌드 도구 없이 바로 실행됩니다:

```bash
# 간단히 파일 열기
open index.html

# 또는 로컬 서버 실행
npx serve .
# python -m http.server 8080
```

---

## 🔑 API 키 보안 주의사항

| 환경 | 권장 방법 |
|------|-----------|
| 로컬 개발 | `window.ANTHROPIC_API_KEY` 직접 설정 |
| GitHub Pages | ❌ API 키 노출 위험 — 서버 프록시 필수 |
| Vercel / Netlify | Environment Variables + Edge Function 사용 |
| 자체 서버 | 서버에서 API 키 관리, 프록시 엔드포인트 제공 |

> ⚠️ API 키를 소스코드에 커밋하거나 공개 저장소에 올리지 마세요.  
> `.gitignore`에 키가 담긴 파일을 반드시 추가하세요.

---

## 🗂️ 프로젝트 구조

```
mindspace/
├── index.html      # 메인 HTML (싱글 페이지)
├── style.css       # 전체 스타일
├── app.js          # 앱 로직 + Claude API 연동
├── README.md       # 이 파일
└── LICENSE         # MIT License
```

---

## 🛠️ 기술 스택

- **Frontend** — HTML5 / CSS3 / Vanilla JavaScript (빌드 도구 불필요)
- **AI Engine** — [Anthropic Claude API](https://anthropic.com) (`claude-sonnet-4-20250514`)
- **폰트** — [Gowun Dodum](https://fonts.google.com/specimen/Gowun+Dodum), [Noto Serif KR](https://fonts.google.com/noto/specimen/Noto+Serif+KR)
- **배포** — GitHub Pages, Netlify, Vercel 등 정적 호스팅 모두 가능

---

## 🤝 기여하기

모든 형태의 기여를 환영합니다. 개발자가 아니어도 참여할 수 있습니다.

### 개발 기여
1. 이 저장소를 Fork하세요
2. 새 브랜치를 만드세요 (`git checkout -b feat/my-feature`)
3. 변경 사항을 커밋하세요 (`git commit -m 'feat: 새 기능 추가'`)
4. 브랜치에 Push하세요 (`git push origin feat/my-feature`)
5. Pull Request를 열어주세요

### 비개발 기여
- 🐛 **버그 리포트** — [Issue 열기](../../issues/new)
- 💡 **기능 제안** — 감정 케어 관련 아이디어 제안
- 🌏 **번역** — 다국어 지원 참여 (현재 한국어)
- 👩‍⚕️ **전문가 자문** — 심리상담사, 사회복지사 등의 콘텐츠 검토

---

## 📄 라이선스

MIT License — 자유롭게 사용, 수정, 배포할 수 있습니다.

```
Copyright (c) 2025 마음공간 프로젝트 기여자들

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

---

## 📬 문의

- **이메일**: hello@mindspace.kr  
- **Issues**: [GitHub Issues](../../issues)

---

<p align="center">
  마음공간 — 당신의 감정은 소중합니다 🌿
</p>
