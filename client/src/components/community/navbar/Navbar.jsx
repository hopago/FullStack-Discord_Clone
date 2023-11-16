import logo from '../../home/navbar/assets/free-icon-computer-settings-2888694.png';

import './navbar.scss';

import CreateModal from './modal/CreateModal';

import ExploreIcon from '@mui/icons-material/Explore';
import AddIcon from '@mui/icons-material/Add';

import { Link } from 'react-router-dom';

import { useRef, useState } from 'react';
import { useGetUserServersQuery } from '../../../features/server/slice/serversApiSlice';

import ArrowRight from './assets/ArrowRight';

const Navbar = () => {
  const {
    data: servers,
    isSuccess,
  } = useGetUserServersQuery();

  const [showServerName, setShowServerName] = useState(false);
  const [currentServerId, setCurrentServerId] = useState("");
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [currentActive, setCurrentActive] = useState(false);

  const handleServerContextMenu = (e) => {
    e.preventDefault();
    setShowContextMenu(true);
  };

  const serverInfo = (serverName) => (
    <div className="serverNameBox">
      <div className="wrapper">
        <span>{serverName}</span>
      </div>
    </div>
  );

  const serverContextMenu = () => (
    <section>
      <div className="wrapper">
        <div className="flexCol">
          <div className="itemContainer">
            <span className='invite'>초대하기</span>
          </div>
          <div className="itemContainer">
            <div className="item">
              <div className="text">
                <span>서버 알림 끄기</span>
                <ArrowRight />
              </div>
              <div className="text">
                <div className="text_flexCol">
                  <span>알림 설정</span>
                  <span className="thin">
                    모든 메시지
                  </span>
                </div>
                <ArrowRight />
              </div>
              <div className="text">
                <span>서버 알림 끄기</span>
                <ArrowRight />
              </div>
            </div>
          </div>
          <div className="itemContainer">
            <span>채널 만들기</span>
            <span>카테고리 만들기</span>
          </div>
        </div>
      </div>
    </section>
  );

  const modalRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const modalOutsideClick = (e) => {
      if (modalRef.current === e.target) {
          setShowModal(false);
      }
  };

  return (
    <div className="community-navbar-lefts">
      <nav className="navbar-wrapper">
        <div className="scroller">
          <div className="tutorialContainer">
            <div className="pill">
              <span></span>
            </div>
            <Link to="/community" className="link">
              <div className="tut-itemWrapper">
                <img src={logo} alt="navbar-tut-logo" />
              </div>
            </Link>
          </div>
          <hr />
          <div aria-label="server" className="server">
            {isSuccess && (
              <div className="flex-col">
                {servers.map((server) => (
                  <Link to={`/community/server/${server._id}`}>
                    <div
                      className="server-items"
                      onMouseEnter={() => {
                        setCurrentServerId(server._id);
                        setShowServerName(true);
                      }}
                      onMouseLeave={() => {
                        setCurrentServerId("");
                        setShowServerName(false);
                      }}
                      onContextMenu={handleServerContextMenu}
                    >
                      <div className="pill"></div>
                      <div className="server-itemWrapper">
                        <img src={server.embeds.thumbnail} alt="" />
                      </div>
                      {showServerName &&
                        currentServerId === server._id &&
                        serverInfo(server.embeds.title)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <hr />
          <div className="tutorialContainer-2">
            <div className="flex-col">
              <div
                className="tut-itemWrapper"
                onClick={() => setShowModal(true)}
              >
                <AddIcon className="icon" />
              </div>
              <Link to="/community/server" className="link">
                <div className="tut-itemWrapper">
                  <ExploreIcon className="icon" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {showModal && (
        <CreateModal
          modalRef={modalRef}
          modalOutsideClick={modalOutsideClick}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}

export default Navbar