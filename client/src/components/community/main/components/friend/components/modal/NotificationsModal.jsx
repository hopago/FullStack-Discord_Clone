import { DoneAll, EmojiPeople, NotificationsActive } from "@mui/icons-material";
import "./notificationsModal.scss";
import { useEffect } from "react";

const NotificationsModal = ({
  modalRef,
  modalOutsideClick,
  setShowNotificationsModal,
}) => {
    useEffect(() => {
      const handleOutsideClick = (e) => modalOutsideClick(e);

      window.addEventListener("click", handleOutsideClick);

      return () => {
        window.removeEventListener("click", handleOutsideClick);
      };
    }, []);

  return (
    <div
      className="notificationModal"
      ref={modalRef}
      onClick={(e) => modalOutsideClick(e)}
    >
      <div className="notificationModal-layer">
        <div className="notificationModal-modal">
          <div className="notificationModal-modal-container">
            <div className="notificationModal-modal-wrapper">
              <div className="notificationModal-contents">
                <div className="container">
                  <div className="topInfo">
                    <div className="wrapper">
                      <div className="top">
                        <div className="iconWrap">
                          <NotificationsActive />
                        </div>
                        <div className="text">
                          <h1>받은 편지함</h1>
                        </div>
                        <div className="friendRequest">
                          <div
                            className="itemWrapper"
                            style={{ cursor: "pointer" }}
                          >
                            <div className="people">
                              <EmojiPeople fontSize="16px" />
                            </div>
                            <div className="count">
                              <span>0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bottom">
                        <div className="texts">
                          <div className="textWrap">
                            <span>나의 알림</span>
                          </div>
                          <div className="textWrap">
                            <span>읽지 않음</span>
                          </div>
                        </div>
                        <div className="readAll">
                          <DoneAll
                            id="doneAll"
                            fontSize="18px"
                            style={{ color: "#A6ABB8" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="scrollNotifications">
                    <div className="wrapper">
                      <div className="scroll">
                        <ul>
                          <li></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
