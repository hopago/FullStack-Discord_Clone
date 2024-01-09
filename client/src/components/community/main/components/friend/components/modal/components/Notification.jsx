import { useState } from "react";
import { timeAgoFromNow } from "../../../../../../../../lib/moment/timeAgo";
import "./notification.scss";
import NotificationPopout from "../popout/NotificationPopout";
import { useNavigate } from "react-router-dom";
import { useSeeNotificationMutation } from "../../../../../../../../features/friends/slice/friendRequestApiSlice";
import { useDispatch } from "react-redux";
import { seeNotification as clientSeeNotification } from "../../../../../../../../features/notifications/friendRequest/friendRequestSlice";

const Notification = ({ notificationsInfo, infoPopout, setFriendActive }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [seeNotification] = useSeeNotificationMutation();

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

  const handleNotificationMessage = (
    { type, _id, senderInfo, createdAt, isRead },
    setFriendActive
  ) => {
    if (type === "friendRequest_send") {
      const moveToFriendRequest = () => {
        if (isRead) {
          setFriendActive(2);
          navigate("/community");
          return;
        }

        seeNotification({
          userName: senderInfo[0].userName,
          type,
        })
          .then((res) => {
            if (res.data) {
              dispatch(
                clientSeeNotification({
                  _id,
                })
              );
            }
          })
          .then((res) => {
            setFriendActive(2);
            navigate("/community");
          })
          .catch((err) => console.error(err));
      };
      
      return (
        <div
          to="/community"
          onClick={moveToFriendRequest}
          className={isRead ? "text-body isRead" : "text-body"}
        >
          <span className="text">
            <b>{senderInfo[0].userName}</b>님이 친구 요청을 보냈어요.
          </span>
          <p className="createdAt">{timeAgoFromNow(createdAt)}</p>
        </div>
      );
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
                  {handleNotificationMessage(notification, setFriendActive)}
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
                    type={notification.type}
                    userName={notification.senderInfo[0].userName}
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
