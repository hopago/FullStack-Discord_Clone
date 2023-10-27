import communication from '../assets/pngwing.com (1).png'
import liveChat from '../assets/live-chat.png';
import expert from '../assets/pngtree-expert-line-icon-vector-png-image_6703002.png';
import {
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    threejs
} from "../assets";

export const infoSectionData = [
    {
        img: `${communication}`,
        title: "개발자를 위한 공간",
        desc: "DevBoard 커뮤니티는 주제 기반 채널로써 협동과 정보를 공유하고 편하게 이야기를 나눌 수 있습니다."
    },
    {
        img: `${liveChat}`,
        title: "실시간 채팅 기능까지",
        desc: "커뮤니티에서 실시간으로 발생하는 모든 대화들을 socket.io를 이용하여 관리하여 보다 쾌적한 이용이 가능합니다."
    },
    {
        img: `${expert}`,
        title: '문제 해결을 위한 곳',
        desc: "개발을 하던 도중 어려움을 느낄 때 즉각 문제를 커뮤니티 회원들과 공유해보세요. 라운지에 있는 맴버들과 대화를 나눌 수 있습니다."
    }
];


export const technologies = [
    {
      name: "HTML 5",
      icon: html,
    },
    {
      name: "CSS 3",
      icon: css,
    },
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "TypeScript",
      icon: typescript,
    },
    {
      name: "React JS",
      icon: reactjs,
    },
    {
      name: "Redux Toolkit",
      icon: redux,
    },
    {
      name: "Tailwind CSS",
      icon: tailwind,
    },
    {
      name: "Node JS",
      icon: nodejs,
    },
    {
      name: "MongoDB",
      icon: mongodb,
    },
    {
      name: "Three JS",
      icon: threejs,
    },
    {
      name: "git",
      icon: git,
    },
    {
      name: "figma",
      icon: figma,
    },
    {
      name: "docker",
      icon: docker,
    },
];