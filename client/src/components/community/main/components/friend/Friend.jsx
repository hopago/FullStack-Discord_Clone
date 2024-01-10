import "./scss/friend.scss";
import {
  Group,
  MapsUgc,
  Help,
  Notifications,
  Search,
} from "@mui/icons-material";
import defaultProfile from "../../assets/default-profile-pic-e1513291410505.jpg";
import { useEffect, useRef, useState } from "react";
import UserInfo from "./components/UserInfo";
import { useLazyGetAllFriendsQuery } from "../../../../../features/users/slice/usersApiSlice";
import {
  useGetNotificationsQuery,
  useLazyGetAllFriendRequestQuery,
  useLazyGetNotificationsQuery,
} from "../../../../../features/friends/slice/friendRequestApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../../features/users/slice/userSlice";
import { socket } from "../../../../..";
import SendFriendForm from "./components/SendFriendForm";
import { useLazyGetAllBlackListQuery } from "../../../../../features/blackList/slice/blackListApiSlice";
import NotificationsModal from "./components/modal/NotificationsModal";
import {
  selectNotSeenNotifications,
  setNotifications,
  socket_addCount,
} from "../../../../../features/notifications/friendRequest/friendRequestSlice";

const Friend = () => {
  const currentUser = useSelector(selectCurrentUser);
  const friendNotificationArr = useSelector(selectNotSeenNotifications);

  const dispatch = useDispatch();

  const [getAllFriends] = useLazyGetAllFriendsQuery();
  const [getAllFriendRequest] = useLazyGetAllFriendRequestQuery();
  const [getAllBlackList] = useLazyGetAllBlackListQuery();
  const { data: friendNotifications } = useGetNotificationsQuery();
  const [getNotifications] = useLazyGetNotificationsQuery();

  const [notificationsInfo, setNotificationsInfo] = useState(null);
  const [active, setActive] = useState(0);
  const [friends, setFriends] = useState(null);
  const [friendList, setFriendList] = useState(null);
  const [fetchType, setFetchType] = useState("온라인");
  const [showSendFriendForm, setShowFriendForm] = useState(false);
  const [contentType, setContentType] = useState("");
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const resetFetchState = () => {
    setContentType("");
    setFriends(null);
    setFriendList(null);
  };

  const fetchOnlineFriends = (e) => {
    resetFetchState();
    handleActiveClass(e);
    socket?.emit("getOnlineFriends", currentUser?._id);
    socket?.on("onlineFriendList", (onlineFriends) => {
      const onlineFriendList = onlineFriends.filter(
        (friend) => friend._id !== currentUser?._id
      );
      setFriends(onlineFriendList);
    });
  };

  const fetchAllFriends = async (e) => {
    resetFetchState();
    handleActiveClass(e);
    const friends = await getAllFriends();

    if (friends.data && friends.data.length) {
      setFriends(friends.data);
    }
  };

  const fetchFriendRequest = async (e) => {
    setContentType("friendRequest");
    setFriends(null);
    setFriendList(null);
    handleActiveClass(e);
    const requestList = await getAllFriendRequest();

    if (requestList) {
      setFriends(requestList.data.members);
    }
  };

  const fetchBlackList = async (e) => {
    setContentType("blackList");
    setFriends(null);
    setFriendList(null);
    handleActiveClass(e);
    const blackList = await getAllBlackList();

    if (blackList.members) {
      setFriends(blackList.data.members);
    }
  };

  const fetchFriendNotifications = async (e) => {
    const { data: notifications } = await getNotifications();
    if (notifications.length) {
      setNotificationsInfo(notifications);
    }
  };

  {/* 친구 정보 컴포넌츠 랜더 */}
  useEffect(() => {
    if (Array.isArray(friends) && friends.length) {
      setFriendList(
        <>
          {friends.length
            ? friends.map((friend) => (
                <UserInfo
                  type={contentType}
                  senderId={friend._id}
                  key={friend._id}
                  defaultProfile={defaultProfile}
                  friend={friend}
                  contentType={contentType}
                />
              ))
            : null}
        </>
      );
    }

    return () => {
      setFriendList(null);
    };
  }, [friends, active]);

  {/* 친구 알림 초기 설정 */}
  useEffect(() => {
    if (friendNotifications?.length) {
      dispatch(setNotifications(friendNotifications));
    }
  }, [friendNotifications?.length]);

  {/* 온라인 유저 fetching 및 랜더 */}
  useEffect(() => {
    try {
      socket?.emit("getOnlineFriends", currentUser?._id);
      socket?.on("onlineFriendList", (onlineFriends) => {
        if (!onlineFriends) return;
        console.log(onlineFriends);
        const filterCurrentUser = onlineFriends.filter((friend) => {
          return friend._id !== currentUser?._id;
        });
        console.log(filterCurrentUser);
        setFriends(filterCurrentUser);
      });
    } catch (err) {
      console.error(err);
    }

    return () => {
      socket?.off("onlineFriendList");
    };
  }, [socket, currentUser]);

  {/* 친구 알림 socket으로부터 올리기 */}
  useEffect(() => {
    socket?.on("getNotification", ({ receiver, requestType }) => {
      if (requestType === ("friendRequest_send" || "friendRequest_accept")) {
        return dispatch(socket_addCount());
      }
    });

    return () => {
      socket?.off("getNotification");
    };
  }, [socket, active]);

  const handleActiveClass = (e) => {
    if (e.target.innerText === "온라인") {
      setActive(0);
      setFetchType("온라인");
    } else if (e.target.innerText === "모두") {
      setActive(1);
      setFetchType("모두");
    } else if (e.target.innerText === "대기 중") {
      setActive(2);
      setFetchType("대기 중");
    } else if (e.target.innerText === "차단 목록") {
      setActive(3);
      setFetchType("차단 목록");
    }
    setShowFriendForm(false);
  };

  const handleShowFriendForm = () => {
    setShowFriendForm(true);
    setActive(4);
  };

  const modalRef = useRef();

  const modalOutsideClick = (e) => {
    if (e.target.closest(".icon")) {
      return;
    }

    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowNotificationsModal(false);
    }
  };

  const handleNotificationIconClick = async (e) => {
    if (e.target.closest(".notificationModal")) {
      return;
    }
    if (showNotificationsModal) {
      return setShowNotificationsModal(false);
    }

    await fetchFriendNotifications();

    setShowNotificationsModal(true);
  };

  return (
    <div className="friend">
      <section className="friend-option-container">
        <div className="wrapper">
          <div className="contents">
            <div className="friend-option-left">
              <div className="currentChannel">
                <Group style={{ color: "#80848E" }} className="friend-icon" />
                <span>친구</span>
              </div>
              <div className="fill" />
              <div className="routes">
                <div
                  className={
                    active === 0 ? "active friend-opt-list" : "friend-opt-list"
                  }
                  onClick={fetchOnlineFriends}
                >
                  온라인
                </div>
                <div
                  className={
                    active === 1 ? "active friend-opt-list" : "friend-opt-list"
                  }
                  onClick={fetchAllFriends}
                >
                  모두
                </div>
                <div
                  className={
                    active === 2
                      ? `active friend-opt-list ${
                          friendNotificationArr.length > 0 &&
                          "friend-request-count"
                        }`
                      : `friend-opt-list ${
                          friendNotificationArr.length > 0 &&
                          "friend-request-count"
                        }`
                  }
                  onClick={fetchFriendRequest}
                >
                  <span className="text">대기 중</span>
                  <div
                    className="notifications"
                    style={
                      !friendNotificationArr.length ? { display: "none" } : {}
                    }
                  >
                    <span className="badge">
                      {friendNotificationArr.length > 0 &&
                        friendNotificationArr.length}
                    </span>
                  </div>
                </div>
                <div
                  className={
                    active === 3 ? "active friend-opt-list" : "friend-opt-list"
                  }
                  onClick={fetchBlackList}
                >
                  차단 목록
                </div>
                <div
                  className={
                    active === 4
                      ? "friend-opt-list last-child active"
                      : "friend-opt-list last-child"
                  }
                  onClick={handleShowFriendForm}
                >
                  친구 추가하기
                </div>
              </div>
            </div>
            <div className="friend-option-right">
              <div className="addConversation">
                <MapsUgc />
              </div>
              <div className="fill" />
              <div className="icons">
                <div
                  className={showNotificationsModal ? "icon active" : "icon"}
                  style={{ position: "relative" }}
                  onClick={handleNotificationIconClick}
                >
                  <Notifications />
                  <div
                    className="notifications"
                    style={
                      !friendNotificationArr.length
                        ? { display: "none" }
                        : { display: "inline-block" }
                    }
                  >
                    <span className="badge">
                      {friendNotificationArr.length > 0 &&
                        friendNotificationArr.length}
                    </span>
                  </div>
                  {showNotificationsModal ? (
                    <NotificationsModal
                      setActive={setActive}
                      modalRef={modalRef}
                      modalOutsideClick={modalOutsideClick}
                      notificationsInfo={notificationsInfo && notificationsInfo}
                    />
                  ) : null}
                </div>
                <div className="icon">
                  <Help />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr />
      <div className="friend-body">
        <div className="body-left">
          {showSendFriendForm ? (
            <SendFriendForm currentUser={currentUser} />
          ) : (
            <>
              <div className="friend-searchBar">
                <div className="wrapper">
                  <div className="innerForm">
                    <form>
                      <input type="text" placeholder="검색하기" />
                    </form>
                  </div>
                  <div className="icon">
                    <Search />
                  </div>
                </div>
              </div>
              <div className="section-title">
                <span>{fetchType}</span>
              </div>
              <div className="friendList-col">{friendList && friendList}</div>
            </>
          )}
        </div>
        <div className="body-right">
          <div className="wrapper">
            <h2>친한 친구</h2>
            <div className="body-right-itemCard">
              {/* fetch */}
              <div className="listItem-wrapper">
                <div className="listItem">
                  <img src={defaultProfile} alt="" />
                  <div className="body-right-userInfo">
                    <span className="body-right-userInfo-userName">
                      UserName
                    </span>
                    <span className="body-right-userInfo-userRole">
                      UserRole
                    </span>
                  </div>
                  <div className="roleIcon">
                    <img
                      src="https://w7.pngwing.com/pngs/79/518/png-transparent-js-react-js-logo-react-react-native-logos-icon.png"
                      alt=""
                    />
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

export default Friend;
