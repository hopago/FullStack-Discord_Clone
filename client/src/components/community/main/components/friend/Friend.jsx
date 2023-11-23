import "./scss/friend.scss";
import {
  Group,
  MapsUgc,
  Help,
  Notifications,
  Search,
} from "@mui/icons-material";
import defaultProfile from "../../assets/default-profile-pic-e1513291410505.jpg";
import { useEffect, useState } from "react";
import UserInfo from "./components/UserInfo";
import { useLazyGetAllFriendsQuery } from "../../../../../features/users/slice/usersApiSlice";
import { useLazyGetAllFriendRequestQuery } from "../../../../../features/friends/slice/friendRequestApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../../features/users/slice/userSlice";
import { socket } from "../../../../..";
import SendFriendForm from "./components/SendFriendForm";

const Friend = () => {
  const currentUser = useSelector(selectCurrentUser);

  const [active, setActive] = useState(0);
  const [friends, setFriends] = useState(null);
  const [fetchType, setFetchType] = useState("온라인");
  const [showSendFriendForm, setShowFriendForm] = useState(false);

  const [
    getAllFriends,
    { data: allFriends, isFetching: isAllFriendsFetching },
  ] = useLazyGetAllFriendsQuery();
  const [
    getAllFriendRequest,
    { data: allFriendRequest, isFetching: isAllFriendRequestFetching },
  ] = useLazyGetAllFriendRequestQuery();

  let friendList;

  const fetchOnlineFriends = (e) => {
    handleActiveClass(e);
    socket?.emit("getOnlineFriends", currentUser?._id);
    socket?.on("onlineFriendList", (onlineFriends) => {
      setFriends(onlineFriends);
    });
    if (Array.isArray(friends) && friends.length) {
      friendList = (
        <>
          {friends?.map((friend) => (
            <UserInfo
              key={friend._id}
              defaultProfile={defaultProfile}
              friend={friend}
            />
          ))}
        </>
      );
    }
  };

  const fetchAllFriends = (e) => {
    handleActiveClass(e);
    getAllFriends(currentUser?._id);
    if (
      Array.isArray(allFriends) &&
      allFriends.length &&
      !isAllFriendsFetching
    ) {
      setFriends(allFriends);
    }
    friendList = (
      <>
        {friends?.map((friend) => (
          <UserInfo
            key={friend._id}
            defaultProfile={defaultProfile}
            friend={friend}
          />
        ))}
      </>
    );
  };

  const fetchFriendRequest = (e) => {
    handleActiveClass(e);
    getAllFriendRequest();
    if (
      Array.isArray(allFriendRequest) &&
      allFriendRequest.length &&
      !isAllFriendRequestFetching
    ) {
      setFriends(allFriendRequest?.table?.members);
    }
    friendList = (
      <>
        {friends?.map((friend) => (
          <UserInfo
            key={friend._id}
            defaultProfile={defaultProfile}
            friend={friend}
          />
        ))}
      </>
    );
  };

  useEffect(() => {
    try {
      socket?.emit("activateUser", currentUser);
      socket?.emit("getOnlineFriends", currentUser?._id);
      socket?.on("onlineFriendList", (onlineFriends) => {
        setFriends(onlineFriends);
      });
      if (Array.isArray(friends) && friends.length) {
        friendList = (
          <>
            {friends?.map((friend) => (
              <UserInfo
                key={friend._id}
                defaultProfile={defaultProfile}
                friend={friend}
              />
            ))}
          </>
        );
      }
    } catch (err) {
      console.error(err);
    }

    return () => {
      socket?.off("onlineFriendList");
    };
  }, [socket, currentUser]);

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
  }

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
                    active === 2 ? "active friend-opt-list" : "friend-opt-list"
                  }
                  onClick={fetchFriendRequest}
                >
                  대기 중
                </div>
                <div
                  className={
                    active === 3 ? "active friend-opt-list" : "friend-opt-list"
                  }
                  onClick={() => {}}
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
                <div className="icon">
                  <Notifications />
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
            <SendFriendForm />
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
