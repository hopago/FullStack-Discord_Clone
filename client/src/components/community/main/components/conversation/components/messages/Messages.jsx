import './messages.scss';
import defaultPP from '../../../../../main/assets/default-profile-pic-e1513291410505.jpg';

const Messages = () => {
    const conversationId = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"; 
    {/* fetch first */}

    const senderId = "JzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpva"; 
    {/* fetch 할 땐 currentUser === receiverId 보낼땐 currentUser === senderId */}

    const receiverId = "wRJSMeKKF2QT4fwpMeJf36POk6yJV"; 
    {/* fetch 할 땐 sender, 보낼 땐 receiver */}

    const currentUserId = "GFnb2UiLCJpYXQiOjE1MTYyMzkwMjJ9"; {/* 기준 */}
    {/* friendId: req.params.friendId, currentUserId: redux local Storage */}



  return (
    <div className="conversation-messages-scrollContent">
      <div className="friendInfoContainer">
        <div className="friendInfoWrapper">
          <div className="friendPPWrapper">
            <img src={defaultPP} alt="" />
          </div>
          <h3>UserName</h3>
          <div className="friendMoreInfo">
            <h3>UserRole</h3>
            <div className="friendMoreInfo-rowBottom">
              <p>UserName님과 나눈 대화의 첫 부분입니다.</p>
              <button>친구 삭제하기</button>
            </div>
          </div>
        </div>
      </div>
      <div className="divider">
        <span>2023년 10월 3일</span>
      </div>
      <div className={`chat-messages ${conversationId}`}>
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
      <div className={`chat-messages ${conversationId}`}>
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
