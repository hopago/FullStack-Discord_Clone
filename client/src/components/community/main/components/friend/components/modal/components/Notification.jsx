import { useState } from "react";
import { timeAgoFromNow } from "../../../../../../../../lib/moment/timeAgo";
import './notification.scss';
import NotificationPopout from "../popout/NotificationPopout";

const handleNotificationMessage = ({ type, senderInfo, createdAt, isRead }) => {
  if (type === "friendRequest_send") {
    return (
      <div className={isRead ? "text-body isRead" : "text-body"}>
        <span className="text">
          <b>{senderInfo[0].userName}</b>님이 친구 요청을 보냈어요.
        </span>
        <p className="createdAt">{timeAgoFromNow(createdAt)}</p>
      </div>
    );
  }
};

const Notification = ({ notificationsInfo, infoPopout }) => {
  const [showInfoPopout, setShowInfoPopout] = useState(false);
  const [showServicesPopout, setShowServicesPopout] = useState(false);

  const showInfo = () => {
    if (showServicesPopout) {
      setShowInfoPopout(false);
      return;
    }
    setShowInfoPopout(true);
  };

  const closeInfo = () => {
    setShowInfoPopout(false);
  };

  const showPopout = () => {
    if (showServicesPopout) {
      setShowServicesPopout(false);
    } else {
      setShowInfoPopout(false);
      setShowServicesPopout(true);
    }
  };

  return (
    <>
      {notificationsInfo?.map((notification) => {
        if (!notification.isRead) {
          return (
            <li key={notification._id} className="notificationItem">
              <div className="content">
                <div className="senderAvatar">
                  <img src={notification.senderInfo[0].avatar} alt="" />
                </div>
                <div className="message">
                  {handleNotificationMessage(notification)}
                </div>
              </div>
              <div
                className="button"
                onMouseEnter={showInfo}
                onMouseLeave={closeInfo}
                onClick={showPopout}
              >
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
                {showInfoPopout && infoPopout}
                {showServicesPopout ? (
                  <NotificationPopout
                    _id={notification._id}
                    setShowServicesPopout={setShowServicesPopout}
                  />
                ) : null}
              </div>
            </li>
          );
        }
      })}
    </>
  );
};

export default Notification;
