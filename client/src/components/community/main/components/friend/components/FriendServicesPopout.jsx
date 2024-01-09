import { useEffect, useRef, useState } from "react";
import ArrowRight from "../../../../navbar/assets/ArrowRight";
import "./friendServicesPopout.scss";
import { Link } from "react-router-dom";
import ConfirmModal from "./modal/ConfirmModal";

const FriendServicesPopout = ({
  setShowContextMenu,
  showContextMenu,
  xy,
  setActive,
  setShowModal,
  moreVertClicked,
  setMoreVertClicked,
  friend
}) => {
  const [requestType, setRequestType] = useState("");

  const handleContextMenuOutsideClick = (e) => {
    if (e.target.closest(".iconWrap") || e.target.closest(".wrapper")) {
      return;
    }

    let currXy = xy;
    const screenX = e.screenX;
    const screenY = e.screenY;

    if (
      (screenX < currXy.x || screenX > currXy.x + 188) &&
      (screenY > currXy.y || screenY > currXy.y + 248)
    ) {
      setActive(false);
      setMoreVertClicked(false);
      setShowContextMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleContextMenuOutsideClick);

    return () => {
      window.removeEventListener("click", handleContextMenuOutsideClick);
    };
  }, [showContextMenu]);

  const modalRef = useRef();
  const [showConfirm, setShowConfirm] = useState(false);

  const modalOutsideClick = (e) => {
    if (modalRef.current === e.target) {
      setShowConfirm(false);
    }
  };

  return (
    <section
      className="friendServicesPopout"
      style={
        moreVertClicked
          ? {
              position: "absolute",
              right: `${xy.x + 11}px`,
              top: `${xy.y + 16}px`,
            }
          : {
              position: "absolute",
              left: `${xy.x + 100}px`,
              top: `${xy.y}px`,
            }
      }
    >
      <div className="wrapper">
        <div className="flexCol">
          <div className="itemContainer">
            <div
              className="text_icon"
              onClick={() => {
                setShowModal(true);
                setActive(false);
                setMoreVertClicked(false);
                setShowContextMenu(false);
              }}
            >
              <span>프로필</span>
            </div>
          </div>
          <div className="itemContainer">
            <div className="text">
              <Link
                to={`/community/conversation/${friend._id}`}
                className="link"
              >
                <div className="text_flexCol">
                  <span>메시지</span>
                </div>
              </Link>
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
          <div
            className="itemContainer"
            onClick={() => {
              setRequestType("삭제");
              setShowConfirm(true);
            }}
          >
            <span>친구 삭제하기</span>
          </div>
          <div className="itemContainer" onClick={() => {
              setRequestType("차단");
              setShowConfirm(true);
            }}>
            <span>차단하기</span>
          </div>
          {showConfirm && (
            <ConfirmModal
              requestType={requestType}
              modalRef={modalRef}
              modalOutsideClick={modalOutsideClick}
              friend={friend}
              setShowConfirm={setShowConfirm}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default FriendServicesPopout;
