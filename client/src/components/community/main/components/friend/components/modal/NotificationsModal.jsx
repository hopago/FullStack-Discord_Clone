import { DoneAll, EmojiPeople, NotificationsActive } from "@mui/icons-material";
import "./notificationsModal.scss";
import { useEffect, useState } from "react";
import { timeAgoFromNow } from "../../../../../../../lib/moment/timeAgo";
import { useGetNotificationsQuery } from "../../../../../../../features/friends/slice/friendRequestApiSlice";

const moreVertInfo = () => (
  <div className="moreVertInfo">
    <span>기타</span>
  </div>
);

const NotificationsModal = ({
  modalRef,
  modalOutsideClick,
  setShowNotificationsModal,

}) => {
  const [showMoreVertInfo, setShowMoreVertInfo] = useState(false);
  const [showMoreVertPopout, setShowMoreVertPopout] = useState(false);
  const [active, setActive] = useState(0);

  const { data: notificationsInfo } = useGetNotificationsQuery();

  useEffect(() => {
    const handleOutsideClick = (e) => {
        if (e.target.closest(".icon")) return;
        modalOutsideClick(e)
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleNotificationMessage = ({ type, senderInfo, createdAt }) => {
    if (type === "friendRequest_send") {
      return (
        <div className="text-body">
          <span className="text">
            <b>{senderInfo[0].userName}</b>님이 친구 요청을 보냈어요.
          </span>
          <p className="createdAt">{timeAgoFromNow(createdAt)}</p>
        </div>
      );
    }
  };

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
                          <div
                            className={
                              active === 0 ? "textWrap active" : "textWrap"
                            }
                            onClick={() => setActive(0)}
                          >
                            <span>나의 알림</span>
                          </div>
                          <div
                            className={
                              active === 1 ? "textWrap active" : "textWrap"
                            }
                            onClick={() => setActive(1)}
                          >
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
                      <ul className="notificationList">
                        {notificationsInfo?.map((notification) => {
                          if (!notification.isRead) {
                            return (
                              <li
                                key={notification._id}
                                className="notificationItem"
                              >
                                <div className="content">
                                  <div className="senderAvatar">
                                    <img
                                      src={notification.senderInfo[0].avatar}
                                      alt=""
                                    />
                                  </div>
                                  <div className="message">
                                    {handleNotificationMessage(notification)}
                                  </div>
                                </div>
                                <div className="button">
                                  <svg
                                    aria-hidden="true"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      fill="currentColor"
                                      fill-rule="evenodd"
                                      d="M4 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                                      clip-rule="evenodd"
                                      class=""
                                    ></path>
                                  </svg>
                                </div>
                              </li>
                            );
                          }
                        })}
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
  );
};

export default NotificationsModal;
