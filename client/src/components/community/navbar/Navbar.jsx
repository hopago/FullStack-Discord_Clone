import logo from "../../home/navbar/assets/free-icon-computer-settings-2888694.png";

import "./navbar.scss";

import CreateModal from "./modal/CreateModal";

import ExploreIcon from "@mui/icons-material/Explore";
import AddIcon from "@mui/icons-material/Add";

import { Link } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import { useGetUserServersQuery } from "../../../features/server/slice/serversApiSlice";

import ArrowRight from "./assets/ArrowRight";

const Navbar = () => {
  const { data: servers, isSuccess } = useGetUserServersQuery();

  const [showServerName, setShowServerName] = useState(false);
  const [currentServerId, setCurrentServerId] = useState("");
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [activeFill, setActiveFill] = useState({
    type: "logo",
    active: true,
    logo_hover: false,
    server_hover: false,
    activeServerId: "",
    hoverServerId: "",
  });

  const [xy, setXy] = useState({ x: 0, y: 0 });

  const handleServerContextMenu = (e, server) => {
    e.preventDefault();
    setShowServerName(false);
    setCurrentServerId(server._id);
    setXy({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleContextMenuOutsideClick = (e) => {
    let currXy = xy;
    const screenX = e.screenX;
    const screenY = e.screenY;

    if (
      (screenX < currXy.x || screenX > currXy.x + 188) &&
      (screenY > currXy.y || screenY > currXy.y + 248)
    ) {
      setCurrentServerId("");
      setShowContextMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleContextMenuOutsideClick);

    return () => {
      window.removeEventListener("click", handleContextMenuOutsideClick);
    };
  }, [showContextMenu]);

  const serverInfo = (serverName) => (
    <div className="serverNameBox">
      <div className="wrapper">
        <span>{serverName}</span>
      </div>
    </div>
  );

  const ServerContextMenu = (index) => {
    const topValue = 111 + index.index * 50;

    return (
      <section
        style={{
          position: "absolute",
          left: `${xy.x}px`,
          top: `${xy.y - topValue}px`,
        }}
      >
        <div className="wrapper">
          <div className="flexCol">
            <div className="itemContainer">
              <span className="invite">초대하기</span>
            </div>
            <hr />
            <div className="itemContainer">
              <div className="text_icon">
                <span>서버 알림 끄기</span>
                <ArrowRight />
              </div>
            </div>
            <div className="itemContainer">
              <div className="text">
                <div className="text_flexCol">
                  <span>알림 설정</span>
                  <span className="thin">모든 메시지</span>
                </div>
                <ArrowRight />
              </div>
            </div>
            <div className="itemContainer">
              <div className="text_icon">
                <span>서버 알림 끄기</span>
                <ArrowRight />
              </div>
            </div>
            <hr />
            <div className="itemContainer">
              <span>채널 만들기</span>
            </div>
            <div className="itemContainer">
              <span>카테고리 만들기</span>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const modalRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const modalOutsideClick = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const logoClicked = () =>
    setActiveFill((prev) => ({
      ...prev,
      active: true,
      type: "logo",
      activeServerId: "",
    }));
  const logoMouseEnter = () => {
    setActiveFill((prev) => ({ ...prev, logo_hover: true }));
  };
  const logoMouseLeave = () => {
    setActiveFill((prev) => ({ ...prev, logo_hover: false }));
  };

  const serverThumbnailClicked = (server) => {
    console.log(server);
    setActiveFill((prev) => ({
      ...prev,
      type: "server",
      active: true,
      activeServerId: server._id,
    }));
  };
  const serverThumbnailMouseEnter = (server) => {
    if (
      (activeFill.type === "logo" && activeFill.active === true) ||
      (activeFill.type === "server" && activeFill.active === true)
    ) {
      setActiveFill((prev) => ({
        ...prev,
        server_hover: true,
        hoverServerId: server._id,
      }));
    }
    if (showContextMenu) return;
    setCurrentServerId(server._id);
    setShowServerName(true);
  };
  const serverThumbnailMouseLeave = () => {
    if (
      (activeFill.type === "logo" && activeFill.active === true) ||
      (activeFill.type === "server" && activeFill.active === true)
    ) {
      setActiveFill((prev) => ({
        ...prev,
        server_hover: false,
        hoverServerId: "",
      }));
    }
    if (showContextMenu) {
      setShowServerName(false);
      return;
    }
    setCurrentServerId("");
    setShowServerName(false);
  };

  return (
    <div className="community-navbar-lefts">
      <nav className="navbar-wrapper">
        <div className="scroller">
          <div
            className="tutorialContainer"
            onClick={logoClicked}
            onMouseEnter={logoMouseEnter}
            onMouseLeave={logoMouseLeave}
          >
            {((activeFill.type === "logo" && activeFill.active) ||
              (activeFill.type === "server" && activeFill.logo_hover)) && (
              <div className="pill">
                <span></span>
              </div>
            )}
            <Link to="/community" className="link">
              <div
                className="tut-itemWrapper"
                style={{
                  backgroundColor: `${
                    activeFill.type === "server" && activeFill.active
                      ? "transparent"
                      : Boolean(
                          activeFill.type === "server" && activeFill.logo_hover
                        )
                      ? "#5865F2"
                      : Boolean(
                          activeFill.active && activeFill.type === "logo"
                        ) && "#5865F2"
                  }`,
                }}
              >
                <img src={logo} alt="navbar-tut-logo" />
              </div>
            </Link>
          </div>
          <hr />
          <div aria-label="server" className="server">
            {isSuccess && servers.length && (
              <div className="flex-col">
                {servers.map((server, index) => (
                  <Link
                    key={`community_server_${server._id}`}
                    to={`/community/server/${server._id}`}
                    onClick={() => serverThumbnailClicked(server)}
                  >
                    <div
                      className="server-items"
                      onMouseEnter={() => serverThumbnailMouseEnter(server)}
                      onMouseLeave={serverThumbnailMouseLeave}
                      onContextMenu={(e) => handleServerContextMenu(e, server)}
                    >
                      {((activeFill.type === "server" &&
                        activeFill.active &&
                        activeFill.activeServerId === server._id) ||
                        (activeFill.server_hover &&
                          activeFill.hoverServerId === server._id)) && (
                        <div className="pill">
                          <span></span>
                        </div>
                      )}
                      <div className="server-itemWrapper">
                        <img src={server.embeds.thumbnail} alt="" />
                      </div>
                      {showServerName &&
                        currentServerId === server._id &&
                        serverInfo(server.embeds.title)}
                      {showContextMenu && currentServerId === server._id && (
                        <ServerContextMenu index={index} />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <hr style={!servers?.length && { display: "none" }} />
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
};

export default Navbar;
