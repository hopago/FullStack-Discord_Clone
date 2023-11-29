import { useEffect } from "react";
import ArrowRight from "../../../../navbar/assets/ArrowRight";
import "./friendServicesPopout.scss";

const FriendServicesPopout = ({
  setShowContextMenu,
  showContextMenu,
  xy,
  setActive,
  setShowModal
}) => {
  const handleContextMenuOutsideClick = (e) => {
    let currXy = xy;
    const screenX = e.screenX;
    const screenY = e.screenY;

    if (
      (screenX < currXy.x || screenX > currXy.x + 188) &&
      (screenY > currXy.y || screenY > currXy.y + 248)
    ) {
      setActive(false);
      setShowContextMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleContextMenuOutsideClick);

    return () => {
      window.removeEventListener("click", handleContextMenuOutsideClick);
    };
  }, [showContextMenu]);

  return (
    <section
      className="friendServicesPopout"
      style={{
        position: "absolute",
        left: `${xy.x + 100}px`,
        top: `${xy.y}px`,
      }}
    >
      <div className="wrapper">
        <div className="flexCol">
          <div className="itemContainer">
            <div className="text_icon" onClick={() => {
              setActive(false);
              setShowModal(true);
            }}>
              <span>프로필</span>
            </div>
          </div>
          <div className="itemContainer">
            <div className="text">
              <div className="text_flexCol">
                <span>메시지</span>
              </div>
              <ArrowRight /> {/* notification count */}
            </div>
          </div>
          <div className="itemContainer">
            <div className="text_icon">
              <span>친구 알림 끄기</span>
              <ArrowRight />
            </div>
          </div>
          <hr />
          <div className="itemContainer">
            <div className="text_icon">
              <span>서버에 초대하기</span>
              <ArrowRight />
            </div>
          </div>
          <div className="itemContainer">
            <span>친구 삭제하기</span>
          </div>
          <div className="itemContainer">
            <span>차단하기</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FriendServicesPopout;
