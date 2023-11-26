import { ChatBubble, Check, Close, MoreVert } from "@mui/icons-material";
import { useHandleRequestFriendMutation } from "../../../../../../features/friends/slice/friendRequestApiSlice";
import { conversationsApiSlice } from "../../../../../../features/conversation/slice/conversationsApiSlice";
import { useState } from "react";

const UserInfo = ({
  defaultProfile,
  friend,
  type,
  senderId,
}) => {
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
      isAccepted
    };

    if (params.senderId && params.isAccepted !== undefined) {
      acceptRejectRequest(params)
        .unwrap()
        .then(async (data) => {
          const { newConversation } = await data;
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

  return (
    <div className="peopleList">
      <div className="listItemWrapper">
        <div className="contents">
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
            <div className="iconWrap" style={{ fontSize: "14px" }}>
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
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
