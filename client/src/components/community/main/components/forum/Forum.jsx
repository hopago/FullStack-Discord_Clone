import { Help, Notifications } from "@mui/icons-material";
import "./scss/forum.scss";
import logo from '../../../../home/navbar/assets/free-icon-computer-settings-2888694.png';
import jsAd from './assets/ad/331739-eng.png';
import backend from './assets/ad/main_521.png';
import adGif from './assets/ad/ezgif-2-46c9d255a1.gif';
import PostCards from "./components/postCards/PostCards";

const Forum = () => {
  {
    /* 게시물 카테고리 - 유저 메인 언어 연결 필요 + fixed navigator top-left 클릭 시 인기, 추천, 게시글 category로 이동 */
  }

  return (
    <div className="community-forum">
      <section className="forum-nav">
        <div className="forum-nav-wrapper">
          <div className="forum-nav-left">
            <img src={logo} alt="" />
            <h1>DevBoard</h1>
            <span>게시판</span>
          </div>
          <div className="forum-nav-right">
            <div className="forum-nav-right-iconWrapper">
              <Notifications />
            </div>
            <div className="forum-nav-right-iconWrapper">
              <Help />
            </div>
          </div>
        </div>
      </section>
      <hr />
      <div className="forum-baseContent">
        <div className="wrapper">
          <main className="ad-contents">
            <div className="items">
              <div className="texts">
                <h1>진짜 자바스크립트 - 기초부터 고급까지</h1>
                <p>
                  프로그래밍의 핵심 원리부터, 변수, 데이터 타입, 연산자, 제어문,
                  함수의 기본까지 단계별로 학습합니다.
                </p>
                <button>얼리버드 25%</button>
              </div>
              <div className="ad-right-img">
                <img src={jsAd} alt="" />
              </div>
            </div>
            <div className="items">
              <div className="texts">
                <h1>백엔드 실무 꿀팁 대방출</h1>
                <p>
                  제대로 배워서 자신있게 쓰는 서버 프레임워크, 현업에서 직접
                  프레임워크를 사용해본 경험과 노하우를 만나보세요.
                </p>
                <button>핵심만 콕콕</button>
              </div>
              <div className="ad-right-img">
                <img src={backend} alt="" />
              </div>
            </div>
            <div className="items">
              <div className="texts">
                <h1>무슨 강의 들을지 고민이라면?</h1>
                <p>현직자 TOP 50 강의 보기</p>
                <button>매달 업데이트</button>
              </div>
              <div className="ad-right-img">
                <img src={adGif} alt="" />
              </div>
            </div>
          </main>
          <div className="forum-category">인기 게시물</div>
          <PostCards type="hot" />
          <div className="forum-category">추천 게시물</div>
          <PostCards type="recommend" />
          <div className="forum-category">게시글 목록</div>
          <PostCards type="all" />
        </div>
      </div>
    </div>
  );
};

export default Forum;
