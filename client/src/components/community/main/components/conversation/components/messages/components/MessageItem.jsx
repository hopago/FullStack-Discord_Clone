import { setTime } from "../../../../../../../../lib/moment/timeAgo";

const MessageItem = ({ isImgUrl, defaultPP, message }) => {
  let content;

  if (isImgUrl) {
    content = (
      <div className={`chat-messages`}>
        <div className="chat-messages-left">
          <img src={message.author.avatar || defaultPP} alt="" />
        </div>
        <div className="chat-messages-right">
          <div className="headerTexts">
            <h3>{message.author.userName}</h3>
            <span>{setTime(message.createdAt, message.updatedAt)}</span>
          </div>
          <div className="message-imgContent">
            <div className="imgContent-wrap">
              <img src={message.referenced_message.content.imgUrl} alt="" />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className={`chat-messages`}>
        <div className="chat-messages-left">
          <img src={message.author.avatar || defaultPP} alt="" />
        </div>
        <div className="chat-messages-right">
          <div className="headerTexts">
            <h3>{message.author.userName}</h3>
            <span>{setTime(message.createdAt, message.updatedAt)}</span>
          </div>
          <div className="message-textContent">
            <span>{message.referenced_message.content.message}</span>
          </div>
        </div>
      </div>
    );
  }

  return content;
};

export default MessageItem;
