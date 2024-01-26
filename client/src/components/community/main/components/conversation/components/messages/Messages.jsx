import './messages.scss';
import defaultPP from '../../../../../main/assets/default-profile-pic-e1513291410505.jpg';
import { setTime } from '../../../../../../../lib/moment/timeAgo';
import capitalizeFirstLetter from '../../../../../../../hooks/CapitalizeFirstLetter';
import MessageList from './components/MessageList';
import { useEffect } from 'react';
import { socket } from '../../../../../../..';
import { messagesApiSlice } from '../../../../../../../features/messages/messagesApiSlice';

const Messages = ({ friend, conversation }) => {
  useEffect(() => {
    socket.on("getMessage", ({ message }) => {
      messagesApiSlice.util.updateQueryData("getMessages", conversation._id, (draftMessages) => {
        const { referenced_message, author } = message;

        const validMessage = {
          referenced_message,
          author
        };

        return [...draftMessages, validMessage];
      })
    });
  }, [socket]);

  return (
    <div className="conversation-messages-scrollContent">
      <div className="friendInfoContainer">
        <div className="friendInfoWrapper">
          <div className="friendPPWrapper">
            <img src={friend?.avatar ?? defaultPP} alt="" />
          </div>
          <h3>{friend?.userName}</h3>
          <div className="friendMoreInfo">
            <h3>Stack: {capitalizeFirstLetter(friend?.language)}</h3>
            <div className="friendMoreInfo-rowBottom">
              <p>{friend?.userName}님과 나눈 대화의 첫 부분입니다.</p>
              <button>친구 삭제하기</button>
            </div>
          </div>
        </div>
      </div>
      <div className="divider">
        <span>{setTime(conversation?.createdAt, conversation?.updatedAt)}</span>
      </div>
      <MessageList defaultPP={defaultPP} />
    </div>
  );
}

export default Messages
