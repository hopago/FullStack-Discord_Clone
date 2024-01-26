import "./conversation.scss";
import ChatNavBar from "./components/chatNavbar/ChatNavBar";
import Messages from "./components/messages/Messages";
import defaultPP from "../../../main/assets/default-profile-pic-e1513291410505.jpg";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../../features/users/slice/userSlice";
import { useGetSingleConversationQuery } from "../../../../../features/conversation/slice/conversationsApiSlice";
import { useEffect, useState } from "react";
import ProfilePanel from "./components/ProfilePanel";
import MessageForm from "./components/messages/components/MessageForm";

const Conversation = () => {
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
      <ChatNavBar friend={friend} />
      <hr />
      <div className="community-conversation-content__container">
        <div className="community-conversation-content__left__wrapper">
          <div className="chatContainer">
            <div className="messagesWrapper">
              <Messages friend={friend} conversation={conversation} />
            </div>
            <MessageForm friend={friend} conversationId={conversationId} />
          </div>
        </div>
        <ProfilePanel
          friend={friend}
          conversationId={conversationId}
          defaultPP={defaultPP}
        />
      </div>
    </div>
  );
};

export default Conversation;
