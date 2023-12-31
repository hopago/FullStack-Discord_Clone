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
import {
  useLazyFindUserByIdQuery,
  useLazyGetAllFriendsQuery,
} from "../../../../../features/users/slice/usersApiSlice";
import {
  useGetReceivedCountQuery,
  useLazyGetAllFriendRequestQuery,
} from "../../../../../features/friends/slice/friendRequestApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../../features/users/slice/userSlice";
import { socket } from "../../../../..";
import SendFriendForm from "./components/SendFriendForm";
import { useLazyGetAllBlackListQuery } from "../../../../../features/blackList/slice/blackListApiSlice";
import NotificationsModal from "./components/modal/NotificationsModal";

const Friend = () => {
  const currentUser = useSelector(selectCurrentUser);

  const [getAllFriends] = useLazyGetAllFriendsQuery();
  const [getAllFriendRequest] = useLazyGetAllFriendRequestQuery();
  const [getAllBlackList] = useLazyGetAllBlackListQuery();
  const { data: receivedCount } = useGetReceivedCountQuery();
  const [findUser] = useLazyFindUserByIdQuery();

  const [active, setActive] = useState(0);
  const [friends, setFriends] = useState(null);
  const [friendList, setFriendList] = useState(null);
  const [fetchType, setFetchType] = useState("온라인");
  const [showSendFriendForm, setShowFriendForm] = useState(false);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [contentType, setContentType] = useState("");
  const [notificationInfo, setNotificationInfo] = useState({
    user: {
      avatar: "",
      userName: ""
    },
    text: ""
  });
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
      const onlineFriendList = onlineFriends.filter(friend => friend._id !== currentUser?._id);
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

    if (friends) {
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
                />
              ))
            : null}
        </>
      );
    }

    return () => {
      setFriendList(null);
    }
  }, [friends, active]);

  useEffect(() => {
    if (receivedCount?.count) {
      setFriendRequestCount(receivedCount.count);
    }
  }, [receivedCount]);

  useEffect(() => {
    try {
      socket?.emit("getOnlineFriends", currentUser?._id);
      socket?.on("onlineFriendList", (onlineFriends) => {
        if (!onlineFriends) return;
        console.log(onlineFriends);
        const filterCurrentUser = onlineFriends.filter(
          (friend) => {
            return friend._id !== currentUser?._id;
          }
        );
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

  useEffect(() => {
    socket?.on(
      "getNotification",
      ({ senderId, requestType, notificationText }) => {
        findUser(senderId)
          .unwrap()
          .then((data) => {
            if (
              senderId &&
              requestType === "FriendRequest" &&
              !notificationText
            ) {
              if (active === 0) {
                setFriends((prev) => [data, ...prev]);
              }
            } else {
              setNotificationInfo((curr) => ({
                ...curr,
                user: {
                  userName: data.userName,
                  avatar: data.avatar ?? defaultProfile,
                },
                text: notificationText,
              }));
            }
          })
          .catch((err) => console.error(err));

        setFriendRequestCount((prev) => prev + 1);
      }
    );

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
  const [showConfirm, setShowConfirm] = useState(false);

  const modalOutsideClick = (e) => {
    if (e.target.closest(".icon")) {
      return;
    }

    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowNotificationsModal(false);
    }
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
                          Number(friendRequestCount) > 0 &&
                          "friend-request-count"
                        }`
                      : `friend-opt-list ${
                          Number(friendRequestCount) > 0 &&
                          "friend-request-count"
                        }`
                  }
                  onClick={fetchFriendRequest}
                >
                  <span className="text">대기 중</span>
                  <div className="notifications">
                    <span className="badge">
                      {Number(friendRequestCount) > 0 && friendRequestCount}
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
                  style={showNotificationsModal ? { position: "relative" } : {}}
                  onClick={() => setShowNotificationsModal((prev) => !prev)}
                >
                  <Notifications />
                  {showNotificationsModal ? (
                    <NotificationsModal
                      modalRef={modalRef}
                      modalOutsideClick={modalOutsideClick}
                      setShowNotificationsModal={setShowNotificationsModal}
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
