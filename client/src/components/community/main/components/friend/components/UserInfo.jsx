import { ChatBubble, Check, Close, MoreVert } from "@mui/icons-material";
import { useHandleRequestFriendMutation } from "../../../../../../features/friends/slice/friendRequestApiSlice";
import { conversationsApiSlice } from "../../../../../../features/conversation/slice/conversationsApiSlice";
import { useRef, useState } from "react";
import FriendServicesPopout from "./FriendServicesPopout";
import ProfileModal from "./modal/ProfileModal";
import { useDeleteBlackListMutation } from "../../../../../../features/blackList/slice/blackListApiSlice";

const UserInfo = ({ defaultProfile, friend, type, senderId }) => {
  const [moreVertClicked, setMoreVertClicked] = useState(false);

  const [acceptRejectRequest] = useHandleRequestFriendMutation();

  const handleRequest = (e) => {
    const { id } = e.target;
    let isAccepted;
    if (id === "friendRequestAccept") {
      isAccepted = true;
    } else {
      isAccepted = false;
    }

    const params = {
      senderId,
      isAccepted,
    };

    if (params.senderId && params.isAccepted !== undefined) {
      acceptRejectRequest(params)
        .unwrap()
        .then((data) => {
          const { newConversation } = data;
          if (newConversation) {
            try {
              conversationsApiSlice.util.updateQueryData(
                "getConversations",
                undefined,
                (draftConversations) => {
                  draftConversations
                    .push(newConversation)
                    .sort((a, b) => b.updatedAt - a.updatedAt);
                }
              );
            } catch (err) {
              console.error(err);
            }
          } else {
            console.log("Something went wrong in conversation...");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const [xy, setXy] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [active, setActive] = useState(false);

  const handleServerContextMenu = (e, type) => {
    if (showModal && type === "friendRequest") {
      return;
    }
    e.preventDefault();

    if (e.type === "click") {
      setMoreVertClicked(true);
    }

    const rect = e.target.getBoundingClientRect();
    setXy({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setActive(true);
    setShowContextMenu(true);
  };

  const modalRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const modalOutsideClick = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  return (
    <div className="peopleList">
      <div
        className={`${active ? "listItemWrapper active" : "listItemWrapper"}`}
      >
        <div
          className="contents"
          style={showModal ? {} : { position: "relative" }}
          onContextMenu={(e) => handleServerContextMenu(e, type)}
        >
          <div className="userInfo">
            <img src={friend.avatar ?? defaultProfile} alt="" />
            <div className="texts">
              <span className="friend-userName">{friend.userName}</span>
              <span className="friend-userRole">{friend.language} 개발자</span>
            </div>
          </div>
          <div className="actions">
            <div className="iconWrap">
              {type === "friendRequest" ? (
                <Check
                  id="friendRequestAccept"
                  onClick={handleRequest}
                  className="accept"
                />
              ) : (
                <ChatBubble style={{ fontSize: "14px" }} />
              )}
            </div>
            <div
              className="iconWrap"
              onClick={(e) => handleServerContextMenu(e, type)}
              style={{ fontSize: "14px" }}
            >
              {type === "friendRequest" ? (
                <Close
                  id="friendRequestReject"
                  onClick={handleRequest}
                  className="reject"
                />
              ) : (
                <MoreVert />
              )}
            </div>
          </div>
          {showContextMenu && (
            <FriendServicesPopout
              friend={friend}
              moreVertClicked={moreVertClicked}
              setMoreVertClicked={setMoreVertClicked}
              type={type}
              setActive={setActive}
              setShowModal={setShowModal}
              xy={xy}
              setShowContextMenu={setShowContextMenu}
              showContextMenu={showContextMenu}
            />
          )}
          {showModal && (
            <ProfileModal
              modalRef={modalRef}
              modalOutsideClick={modalOutsideClick}
              friend={friend}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
