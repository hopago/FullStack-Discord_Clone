import './messages.scss';
import defaultPP from '../../../../../main/assets/default-profile-pic-e1513291410505.jpg';
import { setTime } from '../../../../../../../lib/moment/timeAgo';
import capitalizeFirstLetter from '../../../../../../../hooks/CapitalizeFirstLetter';

const Messages = ({ friend, conversation }) => {


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
      <div className={`chat-messages`}>
        <div className="chat-messages-left">
          <img src={defaultPP} alt="" />
        </div>
        <div className="chat-messages-right">
          <div className="headerTexts">
            <h3>UserName</h3>
            <span>2023.10.03</span>
          </div>
          <div className="messages-content">
            {/* if img */}
            <div className="message-imgContent">
              <div className="imgContent-wrap">
                <img
                  src="https://images.pexels.com/photos/3362698/pexels-photo-3362698.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                  alt=""
                />
              </div>
            </div>
            {/* texts */}
            <div className="message-textContent">
              <span>안녕하세요</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`chat-messages`}>
        <div className="chat-messages-left">
          <img src={defaultPP} alt="" />
        </div>
        <div className="chat-messages-right">
          <div className="headerTexts">
            <h3>UserName</h3>
            <span>2023.10.03</span>
          </div>
          <div className="messages-content">
            {/* if img */}
            <div className="message-imgContent">
              <div className="imgContent-wrap">
                <img
                  src="https://images.pexels.com/photos/3362698/pexels-photo-3362698.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                  alt=""
                />
              </div>
            </div>
            {/* texts */}
            <div className="message-textContent">
              <span>안녕하세요</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages
