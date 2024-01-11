import "./conversation.scss";
import ChatNavBar from "./components/chatNavbar/ChatNavBar";
import Messages from "./components/messages/Messages";
import { Redeem, Gif, EmojiEmotions, Add } from "@mui/icons-material";
import defaultPP from "../../../main/assets/default-profile-pic-e1513291410505.jpg";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../../features/users/slice/userSlice";
import { useGetSingleConversationQuery } from "../../../../../features/conversation/slice/conversationsApiSlice";
import { useEffect, useState } from "react";
import ProfilePanel from "./components/ProfilePanel";

const Conversation = () => {
  const userBackGroundImg = false;
  const userProfilePicture = false;

  const { conversationId } = useParams();
  const { _id: currentUserId } = useSelector(selectCurrentUser);

  const { data: conversation } = useGetSingleConversationQuery(conversationId);

  const [friend, setFriend] = useState(null);

  useEffect(() => {
    if (conversation) {
      const found = conversation.members.find(
        (member) => member._id !== currentUserId
      );
      setFriend(found);
    }
  }, [conversation]);

  return (
    <div className="community-conversation">
      <ChatNavBar friend={friend && friend} />
      <hr />
      <div className="community-conversation-content__container">
        <div className="community-conversation-content__left__wrapper">
          <div className="chatContainer">
            <div className="messagesWrapper">
              <Messages
                friend={friend && friend}
                conversation={conversation && conversation}
              />
            </div>
            <div className="messagesForm">
              <form>
                <div className="formWrapper">
                  <div className="formContentWrapper">
                    <div className="addIcons">
                      <Add style={{ fontSize: "19.5px" }} />
                    </div>
                    <input
                      type="text"
                      placeholder="UserName에게 메시지 보내기"
                    />
                    <div className="rightIcons">
                      <div className="form-icon">
                        <Redeem />
                      </div>
                      <div className="form-icon">
                        <Gif />
                      </div>
                      <div className="form-icon">
                        <EmojiEmotions />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <ProfilePanel friend={friend && friend} defaultPP={defaultPP} />
      </div>
    </div>
  );
};

export default Conversation;
