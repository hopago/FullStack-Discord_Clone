import { MoreVert } from "@mui/icons-material";
import "./profileModal.scss";
import { useEffect, useState } from "react";
import { timeAgoFromNow } from "../../../../../../../lib/moment/timeAgo";
import NoServerExisted from "./assets/e86b4414e7dfa126abbd.svg";
import NoFriendExisted from "./assets/e86b4414e7dfa126abbd1.svg";
import jsIcon from "../../../../../sidebar/assets/language/js_lang.png";
import reactIcon from "../../../../../sidebar/assets/language/react.png";
import nextIcon from "../../../../../sidebar/assets/language/next.png";
import {
  useLazyFindUserByIdQuery,
} from "../../../../../../../features/users/slice/usersApiSlice";
import {
  useLazyGetUserServersQuery,
} from "../../../../../../../features/server/slice/serversApiSlice";
import {
  useAddMemoMutation,
  useDeleteMemoMutation,
  useGetMemoQuery,
  useUpdateMemoMutation,
} from "../../../../../../../features/memos/memosApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../../../../features/users/slice/userSlice";

const ProfileModal = ({ modalOutsideClick, modalRef, friend }) => {
  const infoConstants = [
    "사용자 정보",
    "최근 게시물",
    "같이 있는 서버",
    "같이 아는 친구",
  ];

  const { data } = useGetMemoQuery(friend._id);

  const [currentMoreInfo, setCurrentMoreInfo] = useState(0);
  const [isServerExisted, setIsServerExisted] = useState(false);
  const [isFriendExisted, setIsFriendExisted] = useState(false);
  const [commonFriends, setCommonFriends] = useState([]);
  const [commonServers, setCommonServers] = useState([]);
  const [editMemo, setEditMemo] = useState(false);
  const [memo, setMemo] = useState(data?.memo ?? "");
  const [active, setActive] = useState(0);

  const [addMemo] = useAddMemoMutation();
  const [updateMemo] = useUpdateMemoMutation();
  const [deleteMemo] = useDeleteMemoMutation();

  const [getFriend] = useLazyFindUserByIdQuery();

  const [getUserServers] = useLazyGetUserServersQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currFriend = await getFriend(friend._id)
      .unwrap()
      .catch((err) => {
        console.error(err);
        return;
      });

    const checkMemoAlreadyExisted = Boolean(data?.memo);

    if (memo === "" && checkMemoAlreadyExisted) {
      deleteMemo(currFriend._id);
      setEditMemo((prev) => !prev);
      return;
    }

    if (memo === "" && !data) {
      setEditMemo((prev) => !prev);
      return;
    }

    if (checkMemoAlreadyExisted) {
      await updateMemo({ friendId: currFriend._id, memo })
        .unwrap()
        .then((res) => {
          if (res.status === 201) {
            setMemo(res.memo);
            return;
          }
        })
        .catch((err) => console.error(err));
    } else {
      await addMemo({ friendId: currFriend._id, memo })
        .unwrap()
        .then((res) => {
          if (res.status === 200) {
            setMemo(res.memo);
            return;
          }
        })
        .catch((err) => console.error(err));
    }

    return setEditMemo((prev) => !prev);
  };

  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    let textarea = document.querySelector(".addMemo");

    const handleKeydown = function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit(event);
      }
    };

    textarea?.addEventListener("keydown", handleKeydown);

    return () => {
      textarea?.removeEventListener("keydown", handleKeydown);
    };
  }, [editMemo]);

  useEffect(() => {
    if (active !== 2) return;

    const validateServerExisted = async () => {
      const currentUserServers = await getUserServers(currentUser._id).catch(
        (err) => console.error(err)
      );
      const friendServers = await getUserServers(friend._id).catch((err) =>
        console.error(err)
      );

      if (currentUserServers.status === 400 || friendServers.status === 400) {
        return setIsServerExisted(false);
      }

      const isExisted = currentUserServers?.members?.map((currServerMember) =>
        friendServers?.members.some(
          (member) => member._id === currServerMember._id
        )
      );

      if (Array.isArray(isExisted) && isExisted.length) {
        setIsServerExisted(true);
        setCommonServers(isExisted);
      } else {
        setIsServerExisted(false);
      }
    };

    validateServerExisted();

    return () => {};
  }, [active]);

  useEffect(() => {
    if (active !== 3) return;

    const validateFriendExisted = (currFriend) => {
        console.log(currentUser.friends);
      const isExisted = currentUser?.friends?.filter((currUserFriend) =>
        currFriend.friends.some((friend) => friend._id === currUserFriend._id)
      );

      if (Array.isArray(isExisted) && isExisted.length) {
        setIsFriendExisted(true);
        setCommonFriends(isExisted);
      } else {
        setIsFriendExisted(false);
      }
    };

    const fetchFriend = async () => {
      await getFriend(friend._id)
        .unwrap()
        .catch((err) => {
          console.error(err);
          return;
        });
    };

    const setFriendExisted = async () => {
      const currFriend = await fetchFriend();

      if (currFriend) {
        validateFriendExisted(currFriend && currFriend);
      }
    };

    setFriendExisted();

    return () => {};
  }, [active]);

  let moreInfo;
  let languageIcon;

  if (friend.language === "javascript") {
    languageIcon = <img alt="" className="userLanguage" src={jsIcon} />;
  } else if (friend.language === "react") {
    languageIcon = <img alt="" className="userLanguage" src={reactIcon} />;
  } else if (friend.language === "next") {
    languageIcon = <img alt="" className="userLanguage" src={nextIcon} />;
  }

  switch (currentMoreInfo) {
    case 0:
      moreInfo = (
        <div className="moreInfoSection">
          <div className="date">
            <h1>DevBoard 가입 시기:</h1>
            <p>{timeAgoFromNow(friend.createdAt)}</p>
          </div>
          <div className="localMemo">
            <h2>메모</h2>
            {editMemo ? (
              <form onSubmit={handleSubmit}>
                <textarea
                  className="addMemo"
                  placeholder="엔터로 메모 업데이트"
                  onChange={(e) => setMemo(e.target.value)}
                  value={memo}
                />
              </form>
            ) : (
              <p onClick={() => setEditMemo(true)}>
                {data?.memo ?? "클릭하여 메모 추가하기"}
              </p>
            )}
          </div>
        </div>
      );
      break;
    case 1:
      moreInfo = (
        <div className="moreInfoSection">
          <div className="postInfo">
            <div className="postImgWrap">
              <img src="" alt="" />
            </div>
            <h2>인기 게시글</h2>
            <div className="postInfoCol">
              <h1>PostTitle</h1>
              <p>Description ShortCut</p>
              <p>Liked Count</p>
            </div>
          </div>
          <div className="postInfo">
            <div className="postImgWrap">
              <img src="" alt="" />
            </div>
            <h2>최근 게시글</h2>
            <div className="postInfoCol">
              <h1>PostTitle</h1>
              <p>Description ShortCut</p>
              <p>Liked Count</p>
            </div>
          </div>
        </div>
      );
      break;
    case 2:
      moreInfo = (
        <div className="moreInfoSection">
          {isServerExisted ? (
            commonServers?.map((server) => (
              <div className="serverInfo" key={server._id}>
                <div className="serverIconWrap">
                  <img src={server.embeds.thumbnail} alt="" />
                </div>
                <p>{server.embeds.title}</p>
              </div>
            ))
          ) : (
            <div className="emptyServerInfo">
              <img src={NoServerExisted} alt="" />
              <p>같이 있는 서버가 없음.</p>
            </div>
          )}
        </div>
      );
      break;
    case 3:
      moreInfo = (
        <div className="moreInfoSection">
          {isFriendExisted ? (
            commonFriends?.map((friend) => (
              <div className="friendInfo" key={friend._id}>
                <div className="flexRow">
                  <div className="userAvatar">
                    <img className="avatar" src={friend.avatar} alt="" />
                  </div>
                  <span>{friend.userName}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="emptyFriendInfo">
              <img src={NoFriendExisted} alt="" />
              <p>같이 아는 친구가 없음.</p>
            </div>
          )}
        </div>
      );
      break;
    default:
      break;
  }

  return (
    <div className="profileModal">
      <div className="profileModal-backgroundDrop" />
      <div
        className="profileModal-layer"
        ref={modalRef}
        onClick={(e) => modalOutsideClick(e)}
      >
        <div className="profileModal-modal">
          <div className="profileModal-modal-container">
            <div className="profileModal-modal-wrapper">
              <div className="profileModal-contents">
                <section className="profileInterface">
                  <div className="header">
                    <div className="top">
                      <header className="banner">
                        <div className="fill" />
                      </header>
                      <div className="absoluteUserAvatar">
                        <div className="imgWrap">
                          <img src={friend.avatar} alt="" />
                          <div className="language">{languageIcon}</div>
                        </div>
                      </div>
                      <div className="absoluteServiceContainer">
                        <div className="empty" />
                        <div className="services">
                          <button>메시지 보내기</button>
                          <MoreVert className="friendService" />
                        </div>
                      </div>
                    </div>
                    <div className="bottom">
                      <div className="wrapper">
                        <div className="userInfo">
                          <h2>{friend.userName}</h2>
                          <p>
                            {friend.userName}#{friend.tag}
                          </p>
                        </div>
                        <div className="selectSection">
                          <div className="selectWrap">
                            <div className="textContainer">
                              {infoConstants.map((text, index) => (
                                <div
                                  className={
                                    active === index
                                      ? "textWrap active"
                                      : "textWrap"
                                  }
                                  onClick={() => {
                                    setCurrentMoreInfo(index);
                                    setActive(index);
                                  }}
                                  key={`${text}${index}`}
                                >
                                  <span className="innerText">{text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="moreInfo">{moreInfo}</div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
