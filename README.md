## Devboard
## 📌 Overview
<br />
Devboard는 개발자를 위한 커뮤니티입니다. 회원가입시에 자신의 기술스택을 선택할 수 있으며 선택한 기술은 사용자의 프로필 모달에 노출되어 해당 사용자가 어떤 기술을 사용하는지 알 수 있도록 하였습니다. 이는 포럼 섹션의 카테고리와도 연동되어 선택된 기술 스택 기반으로 게시글을 추천할 수 있도록 하였고 개발자는 카테고리를 선택하여 게시글을 작성할 수 있습니다. 댓글 기능을 통해 게시글 작성자와 소통하고 친구 추가를 할 수 있으며 개인 메시지를 보내 소통하고, 여러 사람을 모아 서버를 구축하여 지속적으로 교류할 수 있는 연대를 만들어 나갈 수 있습니다.

<br />

  ### 🔍 Table of Contents
- 💻 Stack
- 📝 Project Summary
- ⚙️ Setting Up
- 🚀 Run Locally

<br />

## 💻 Stack

- [react](https://reactjs.org/): 클라이언트는 React@18 버전으로 구성되었습니다.
- [typescript](https://www.typescriptlang.org/): Api 코드는 typescript로 작성되었고 dist/src에 JS 파일로 빌드하였습니다.
- [scss]: CSS 파일을 따로 분류하고 부모, 자식과의 관계를 파악하기 쉬워 유지보수가 용이하다는 측면에서 SCSS를 선택하였습니다.
- [three.js](https://github.com/emilkowalski/vaul): 마케팅 페이지는 고객에게 주는 첫 인상인 만큼 화려한 인상을 주기 위해 3D 모델링을 위한 three.js를 활용하였습니다.
- [framer-motion](https://github.com/emilkowalski/sonner): 단순 정보 나열은 지루함을 줄 수 있기에 framer-motion의 애니메이션을 마케팅 페이지에 적극 활용하였습니다.
- [redux](https://github.com/ueberdosis/tiptap): 실시간 알림이나 로그인 된 유저 정보와 같이 전역적으로 쓰이는 클라이언트 상태 관리는 리덕스를 활용하여 진행했습니다.
- [redux-toolkit-query](https://github.com/vercel/swr): 서버 상태 관리, 데이터 캐싱은 rtk-query를 활용하여 진행했습니다.
