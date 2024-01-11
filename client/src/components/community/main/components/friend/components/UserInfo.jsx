import { ChatBubble, Check, Close, MoreVert } from "@mui/icons-material";
import { useHandleRequestFriendMutation } from "../../../../../../features/friends/slice/friendRequestApiSlice";
import { conversationsApiSlice, useLazyGetConversationByMemberIdQuery } from "../../../../../../features/conversation/slice/conversationsApiSlice";
import { useRef, useState } from "react";
import FriendServicesPopout from "./FriendServicesPopout";
import ProfileModal from "./modal/ProfileModal";
import { useNavigate } from "react-router-dom";

const UserInfo = ({
  defaultProfile,
  friend,
  type,
  senderId,
  contentType,
}) => {
  const navigate = useNavigate();

  const [moreVertClicked, setMoreVertClicked] = useState(false);

  const [acceptRejectRequest] = useHandleRequestFriendMutation();
  const [getConversationByFriendId] = useLazyGetConversationByMemberIdQuery();

  const fetchConversationId = async () => {
    const { data: conversation } = await getConversationByFriendId(friend._id);

    return conversation._id;
  };

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
    if (
      (showModal && type === "friendRequest") ||
      contentType === "friendRequest"
    ) {
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

  const moveToMessage = async () => {
    if (type !== "friendRequest") {
      const conversationId = await fetchConversationId();

      navigate(`/community/conversation/${conversationId}`);
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
            <div className="iconWrap" onClick={moveToMessage}>
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
              isFriend={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
