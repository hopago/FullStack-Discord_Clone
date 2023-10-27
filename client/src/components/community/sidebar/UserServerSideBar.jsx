import {
  AccountCircle,
  Help,
  Settings,
  Star,
  Verified,
  ArrowDropDown,
  Tag,
} from "@mui/icons-material";
import "./scss/userServerSideBar.scss";
import profile from "./assets/default-profile-pic-e1513291410505.jpg";
import { announcement, hashTag, rules } from "./assets/sampleCatIcon";

const UserServerSideBar = () => {
  return (
    <nav className="customServerSideBar">
      <div className="header-container">
        <header>
          <div className="headerItems">
            <div className="header-left">
              <img
                src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png"
                alt=""
              />
              <span>ServerName</span>
            </div>
            <div className="header-right">
              <ArrowDropDown />
            </div>
          </div>
        </header>
      </div>
      <hr />
      <div className="customServerSideBar-scroller">
        <ul className="contents">
          <li className="defaultContainer">
            <div className="wrapper">
              <div className="content">
                <div className="iconContainer">
                  <Tag style={{ fontSize: "16px" }} />
                </div>
                <span className="content-text">채널 훑어보기</span> {/* Link to ServerInfo */}
              </div>
            </div>
          </li>
          {/* custom category fetch, Link to category Name */}
          <li className="customListContainer">
            <div className="customListItems">
              <div className="listHeader">
                <ArrowDropDown />
                <span>Parent Cat Name</span>
              </div>
            </div>
            {/** child */}
            <div className="customListItems">
              <div className="listCategory">
                <div className="wrapper">
                  <div className="svgIcon">{announcement}</div>
                  <span>announcement</span>
                </div>
              </div>
            </div>
            <div className="customListItems">
            <div className="listCategory">
              <div className="wrapper">
                <div className="svgIcon">{rules}</div>
                <span>rules</span>
              </div>
            </div>
            </div>
            <div className="customListItems">
            <div className="listCategory">
              <div className="wrapper">
                <div className="svgIcon">{hashTag}</div>
                <span>commands</span>
              </div>
            </div>
            </div>
          </li>
        </ul>
      </div>
      <section className="community-sidebar-user">
        <div className="wrapper">
          <img src={profile} alt="" />
          <div className="texts">
            <h4>hopago</h4>
            <div className="user-icons">
              <Verified style={{ color: "#248046", fontSize: "16px" }} />
              <Star style={{ color: "#FFD33E", fontSize: "16px" }} />
            </div>
          </div>
          <div className="icons">
            <div className="iconWrap">
              <AccountCircle className="profile-btn" />
            </div>
            <div className="iconWrap">
              <Settings className="setting-btn" />
            </div>
            <div className="iconWrap">
              <Help className="help-btn" />
            </div>
          </div>
        </div>
      </section>
    </nav>
  );
};

export default UserServerSideBar;
