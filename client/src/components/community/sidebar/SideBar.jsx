import { Link, useParams } from "react-router-dom";
import "./scss/sidebar.scss";
import {
  Group,
  Forum,
  Explore,
  Settings,
  Help,
  AccountCircle,
  Verified,
  Star,
  Computer,
  School,
  Work,
  Science,
  AccountTree,
} from "@mui/icons-material";
import profile from "./assets/default-profile-pic-e1513291410505.jpg";
import { useEffect, useRef, useState } from "react";
import NavModal from "./modal/NavModal";
import UserServerSideBar from "./UserServerSideBar";
import js from "./assets/language/js_lang.png";
import react from "./assets/language/react.png";
import next from "./assets/language/next.png";
import Profile from "./popout/Profile";
import { useGetCurrentUserQuery } from "../../../features/users/slice/usersApiSlice";

export const categories = [
  {
    icon: <Explore />,
    category: "All",
  },
  {
    icon: <Computer />,
    category: "Programming",
  },
  {
    icon: <School />,
    category: "Education",
  },
  {
    icon: <Work />,
    category: "Job",
  },
  {
    icon: <Science />,
    category: "Tech",
  },
  {
    icon: <AccountTree />,
    category: "Project",
  },
];

const ServerSideBar = () => {
  const [active, setActive] = useState("All");

  return (
    <>
      <div className="community-sidebar">
        <div className="community-sidebar-wrapper serverSidebar">
          <h2 className="community-serverSidebar-heading">찾기</h2>
          {categories.map((cat) => (
            <div
              key={`serverSidebar_${cat.category}`}
              className={
                active === cat.category
                  ? "community-serverSidebar-list active"
                  : "community-serverSidebar-list"
              }
              onClick={() => setActive(cat.category)}
            >
              <div className="serverSidebar-list-wrap">
                <div className="serverSidebar-list-icon">{cat.icon}</div>
                <div
                  className={
                    active === cat.category
                      ? "serverSidebar-list-content active"
                      : "serverSidebar-list-content"
                  }
                >
                  {cat.category}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* memoization */}
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
      </div>
    </>
  );
};

const SideBar = ({ type: basePathName }) => {
  const { data: currentUser } = useGetCurrentUserQuery();

  const modalRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const modalOutsideClick = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const params = useParams();
  const pathName = Object.values(params)[0];

  const [activeArray, setActiveArray] = useState([]);

  useEffect(() => {
    switch (pathName) {
      case "":
        setActiveArray([0]);
        break;
      case "forum":
        setActiveArray([1]);
        break;
      case "server":
        setActiveArray([2]);
        break;
      default:
        break;
    }
  }, [pathName]);

  if (basePathName === "server") return <ServerSideBar />;

  if (pathName.split("/")[0] === "server" && pathName.split("/")[1] !== "")
    return <UserServerSideBar />;

  const LanguageImg = () => {
    if (currentUser.language === "javascript") return <img alt="" src={js} />;
    if (currentUser.language === "react") return <img alt="" src={react} />;
    if (currentUser.language === "next") return <img alt="" src={next} />;
  };

  return (
    <div className="community-sidebar">
      <div className="community-sidebar-wrapper">
        <nav>
          <div className="community-searchBar">
            <button onClick={() => setShowModal(true)}>
              대화 찾기 또는 시작하기
            </button>
          </div>
          <hr />
        </nav>
        <div className="community-sidebar-scroller">
          <div className="wrapper">
            <ul>
              <Link to="/community" className="link">
                <li
                  className={
                    activeArray[0] === 0
                      ? "community-route active"
                      : "community-route"
                  }
                >
                  <Group />
                  <span>친구</span>
                </li>
              </Link>
              <Link to="/community/forum" className="link">
                <li
                  className={
                    activeArray[0] === 1
                      ? "community-route active"
                      : "community-route"
                  }
                >
                  <Forum />
                  <span>포럼</span>
                </li>
              </Link>
              <Link to="/community/server" className="link">
                <li
                  className={
                    activeArray[0] === 2
                      ? "community-route active"
                      : "community-route"
                  }
                >
                  <Explore />
                  <span>서버</span>
                </li>
              </Link>
              <h2 className="private-message-bradCrumbs">Private Messages</h2>
              <Link to="/community/conversation/:friendId" className="link">
                <li className="sidebar-friend">
                  <div className="sidebar-pp">
                    <img src={profile} alt="" />
                    <div className="status-fill" />
                  </div>
                  <div className="sidebar-friendInfo">
                    <h2 className="friend-name">지인</h2>
                    <p>React 개발자</p>
                  </div>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
      <section className="community-sidebar-user">
        <div className="wrapper">
          <div
            className="currUserProfileWrapper"
            onClick={() => setShowProfile(true)}
          >
            <img src={currentUser.avatar} alt="" />
            <div className="texts">
              <h4>{currentUser.userName}</h4>
              <div className="user-icons">
                <Verified style={{ color: "#248046", fontSize: "16px" }} />
                <LanguageImg />
              </div>
            </div>
          </div>
          {showProfile && (
            <Profile
              showProfile={showProfile}
              setShowProfile={setShowProfile}
              currentUser={currentUser}
            />
          )}
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
      {showModal && (
        <NavModal modalRef={modalRef} modalOutsideClick={modalOutsideClick} />
      )}
    </div>
  );
};

export default SideBar;
