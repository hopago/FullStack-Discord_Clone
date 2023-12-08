import { useEffect } from "react";
import "./friendServicePopout.scss";

{
  /* 차단, 신고, 친구삭제, 서비스 로직 */
}

const FriendServicePopout = ({ showPopout, setShowPopout, xy }) => {
  const handleServicePopoutOutsideClick = (e) => {
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (
        (clientX < xy.x || clientX > xy.x + 165) ||
        (clientY < xy.y || clientY > xy.y + 120)
      ) {
        setShowPopout(false);
      }
  };

  useEffect(() => {
    window.addEventListener("click", handleServicePopoutOutsideClick);

    return () => {
      window.removeEventListener("click", handleServicePopoutOutsideClick);
    };
  }, [showPopout]);

  return (
    <div
      className="friendServicePopout"
      style={{
        top: `26px`,
        right: `-153px`
      }}
    >
      <div className="wrapper">
        <div className="flexCol">
          <span>차단하기</span>
        </div>
        <div className="flexCol">
          <span>사용자 프로필 신고하기</span>
        </div>
        <div className="flexCol">
          <span className="lastChild">메세지 보내기</span>
        </div>
      </div>
    </div>
  );
};

export default FriendServicePopout;
