import './conversation.scss';
import ChatNavBar from './components/chatNavbar/ChatNavBar'
import Messages from './components/messages/Messages'
import {
  Redeem,
  Gif,
  EmojiEmotions,
  Add
} from '@mui/icons-material';
import defaultPP from '../../../main/assets/default-profile-pic-e1513291410505.jpg';

const Conversation = () => {
  const userBackGroundImg = false;
  const userProfilePicture = false;

  return (
    <div className="community-conversation">
      <ChatNavBar />
      <hr />
      <div className="community-conversation-content__container">
        <div className="community-conversation-content__left__wrapper">
          <div className="chatContainer">
            <div className="messagesWrapper">
              <Messages />
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
        <div className="profilePanel">
          <div className="profilePanel-ImgContainer">
            <div className="wrapper">
              {userBackGroundImg ? (
                <img src="" alt="" className="background" />
              ) : (
                <div className="background-fill" />
              )}
              <div className="profilePictureWrapper">
                {userProfilePicture ? (
                  <img src="" className="profileImg" />
                ) : (
                  <img src={defaultPP} />
                )}
                <div className="roleImgWrapper">
                  <img
                    src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png"
                    className="roleImg"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="profilePanel-userInfo">
            <div className="profilePanel-userInfo-wrapper">
              <div className="top">
                <div className="userText">
                  <h4>UserName</h4>
                  <p>UserRole</p>
                </div>
              </div>
              <hr className="userInfo-divider" />
              <div className="center">
                <span>내 소개</span>
                <p>User Description</p>
              </div>
              <hr className="userInfo-divider" />
              <div className="bottom">
                <span>최근 게시글</span>
                <p>Post Title</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conversation
