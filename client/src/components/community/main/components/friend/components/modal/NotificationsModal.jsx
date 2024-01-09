import { DoneAll, EmojiPeople, NotificationsActive } from "@mui/icons-material";
import "./notificationsModal.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  classifyNotifications,
  selectCurrNotifications,
  selectNotSeenNotifications,
  setNotifications,
} from "../../../../../../../features/notifications/friendRequest/friendRequestSlice";
import Notification from "./components/Notification";

const InfoPopout = ({ message }) => (
  <div className="moreVertInfo">
    <span>{message}</span>
  </div>
);

const NotificationsModal = ({
  modalRef,
  modalOutsideClick,
  notificationsInfo
}) => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectCurrNotifications);
  const notSeenNotifications = useSelector(selectNotSeenNotifications);

  const [currNotifications, setCurrNotifications] = useState(notifications);
  const [showInfoPopout, setShowInfoPopout] = useState(false);
  const [currInfoPopout, setCurrInfoPopout] = useState(0);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);

  const onHover = (e) => {
    if (e.target.closest(".servicesPopout")) {
        setHover(false);
        return;
    }

    setHover(true);
  }

  const offHover = () => {
    setHover(false);
  }

  const handleCurrInfoPopout = (number) => {
    setCurrInfoPopout(number);
    setShowInfoPopout(true);
  };

  const closeInfoPopout = () => {
    setShowInfoPopout(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.closest(".icon")) return;
      modalOutsideClick(e);
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (notificationsInfo?.length > 0) {
      dispatch(setNotifications(notificationsInfo));
      dispatch(classifyNotifications());
    }
  }, [notificationsInfo?.length, dispatch]);

  useEffect(() => {
    if (active === 0) {
        setCurrNotifications(notifications);
    } else if (active === 1) {
        setCurrNotifications(notSeenNotifications);
    }
  }, [active]);

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
                            onMouseEnter={() => handleCurrInfoPopout(0)}
                            onMouseLeave={closeInfoPopout}
                          >
                            <div className="people">
                              <EmojiPeople fontSize="16px" />
                            </div>
                            <div className="count">
                              <span>{notSeenNotifications?.length}</span>
                            </div>
                            {showInfoPopout && currInfoPopout === 0 ? (
                              <InfoPopout message="친구 요청 보기" />
                            ) : null}
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
                        <div
                          className="readAll"
                          onMouseEnter={() => handleCurrInfoPopout(1)}
                          onMouseLeave={closeInfoPopout}
                        >
                          <DoneAll
                            id="doneAll"
                            fontSize="18px"
                            style={{ color: "#A6ABB8" }}
                          />
                          {showInfoPopout && currInfoPopout === 1 ? (
                            <InfoPopout message="모두 읽음으로 표시" />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="scrollNotifications">
                    <div className="wrapper">
                      <ul
                        className="notificationList"
                        onMouseEnter={onHover}
                        onMouseLeave={offHover}
                        style={
                          hover
                            ? { backgroundColor: "#282A2E" }
                            : { backgroundColor: "inherit" }
                        }
                      >
                        <Notification
                          notificationsInfo={currNotifications}
                          infoPopout={<InfoPopout message="기타" />}
                        />
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
