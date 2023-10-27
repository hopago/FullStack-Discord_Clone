import './chatNavbar.scss';
import {
    AddIcCall,
    Videocam,
    PushPin,
    Block,
    Search,
    Notifications,
    Help
} from '@mui/icons-material';
import defaultPP from '../assets/default-profile-pic-e1513291410505.jpg';

const ChatNavBar = () => {
  return (
    <div className="chatNavBar">
      <div className="upperWrapper">
        <div className="upperLeft">
          <img src={defaultPP} alt="" />
          <span>UserName</span>
        </div>
        <div className="upperRight">
          <div className="iconWrapper">
            <AddIcCall />
          </div>
          <div className="iconWrapper">
            <Videocam />
          </div>
          <div className="iconWrapper">
            <PushPin />
          </div>
          <div className="iconWrapper">
            <Block />
          </div>
          <div className="search__smBar">
            <form>
              <input type="text" placeholder="검색하기" />
            </form>
            <div className="searchIconContainer">
              <Search style={{ fontSize: "16px" }} />
            </div>
          </div>
          <div className="notificationsIcon">
            <Notifications />
          </div>
          <div className="helpIcon">
            <Help />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatNavBar
