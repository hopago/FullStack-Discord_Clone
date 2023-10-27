import './userServer.scss';
import UserServerNavbar from './components/UserServerNavbar'
import { Add } from '@mui/icons-material';
import ServerChats from './components/ServerChats';

const UserServer = () => {
  return (
    <div className="customServer">
      <UserServerNavbar />
      <hr />
      <div className="customServer__container">
        <div className="customServer__left__wrapper">
          <div className="chatContainer">
            <div className="messagesWrapper">
              <ServerChats />
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
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserServer
