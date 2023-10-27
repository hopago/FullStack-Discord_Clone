import './userServerNavbar.scss';
import {
    rulesIcon,
    navHash,
    navAlarm
} from './assets/index';
import { PushPin, Group, Notifications, Help, Search } from "@mui/icons-material";

const UserServerNavbar = () => {
  return (
    <div className="userServerNavbar">
      <div className="upperWrapper">
        <div className="upperLeft">
          {/* selected category icon display */}
          {rulesIcon}
          <span>rules</span>
        </div>
        <div className="upperRight">
          <div className="iconWrapper">
            {navHash}
          </div>
          <div className="iconWrapper">
            {navAlarm}
          </div>
          <div className="iconWrapper">
            <PushPin />
          </div>
          <div className="iconWrapper">
            <Group />
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

export default UserServerNavbar
