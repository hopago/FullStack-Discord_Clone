import './serverChats.scss';
import defaultPP from '../../../assets/default-profile-pic-e1513291410505.jpg';

const ServerChats = () => {
  return (
    <div className="serverChats">
      <div className="server-category-InfoContainer">
        <div className="server-category-InfoWrapper">
          <div className="server-category-PPWrapper">
            <img src={defaultPP} alt="" />
          </div>
          <h3>#catName에 오신 걸 환영합니다!</h3>
          <div className="server-category-MoreInfo">
            <div className="server-category-MoreInfo-rowBottom">
              <p>#catName 채널의 시작이에요.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="divider">
        <span>2023년 10월 3일</span>
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

export default ServerChats
