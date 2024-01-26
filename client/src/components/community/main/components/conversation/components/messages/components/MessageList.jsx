import { useState } from "react";
import { useGetMessagesQuery } from "../../../../../../../../features/messages/messagesApiSlice";
import MessageItem from "./MessageItem";
import { useParams } from "react-router-dom";

const MessageList = ({ defaultPP }) => {
  const { conversationId } = useParams();

  const [fetchCount, setFetchCount] = useState(0);

  const { data: messages } = useGetMessagesQuery({
    conversationId,
    fetchCount,
  });

  return (
    <div className="messages-content">
      {messages?.length &&
        messages?.map((message) => (
          <MessageItem
            defaultPP={defaultPP}
            message={message}
            isImgUrl={Boolean(message.referenced_message.content.imgUrl)}
          />
        ))}
    </div>
  );
};

export default MessageList;
