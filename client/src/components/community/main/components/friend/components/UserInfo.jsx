import { ChatBubble, MoreVert } from "@mui/icons-material";


const UserInfo = ({ defaultProfile, friend }) => {
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
              <ChatBubble style={{ fontSize: "14px" }} />
            </div>
            <div className="iconWrap" style={{ fontSize: "14px" }}>
              <MoreVert />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo
