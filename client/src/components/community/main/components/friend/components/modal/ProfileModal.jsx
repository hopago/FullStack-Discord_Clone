import { MoreVert } from "@mui/icons-material";
import "./profileModal.scss";
import { useState } from "react";
import { timeAgoFromNow } from "../../../../../../../lib/moment/timeAgo";
import NoServerExisted from './assets/e86b4414e7dfa126abbd.svg';

const ProfileModal = ({ modalOutsideClick, modalRef, friend }) => {
  const [currentMoreInfo, setCurrentMoreInfo] = useState(0);
  const isServerExisted = false;
  const isFriendExisted = false;

  let moreInfo;
  let languageIcon;

  if (friend.language === "javascript") {

  } else if (friend.language === "react") {

  } else if (friend.language === "next") {
    
  }

  switch (currentMoreInfo) {
    case 0:
      moreInfo = (
        <div className="moreInfoSection">
          <div className="date">
            <h1>DevBoard 가입 시기:</h1>
            <p>{timeAgoFromNow(friend.createdAt)}</p>
          </div>
          <div className="localMemo">
            <h2>메모</h2>
            <p>클릭하여 메모 추가하기</p>
          </div>
        </div>
      );
      break;
    case 1:
      moreInfo = (
        <div className="moreInfoSection">
          <div className="postInfo">
            <div className="postImgWrap">
              <img src="" alt="" />
            </div>
            <div className="postInfoCol">
              <h1>PostTitle</h1>
              <p>Description ShortCut</p>
              <p>Liked Count</p>
            </div>
          </div>
          <div className="postInfo">
            <div className="postImgWrap">
              <img src="" alt="" />
            </div>
            <div className="postInfoCol">
              <h1>PostTitle</h1>
              <p>Description ShortCut</p>
              <p>Liked Count</p>
            </div>
          </div>
        </div>
      );
      break;
    case 2:
      moreInfo = (
        <div className="moreInfoSection">
          {isServerExisted ? (
            <div className="serverInfo">
              <div className="serverIconWrap">
                <img src="" alt="" />
              </div>
              <p>ServerName</p>
            </div>
          ) : (
            <div className="emptyServerInfo">
              <NoServerExisted />
              <p>같이 있는 서버가 없음.</p>
            </div>
          )}
        </div>
      );
      break;
    case 3:
      moreInfo = (
        <div className="moreInfoSection">
          {isFriendExisted ? (
            <div className="friendInfo">
                <div className="flexRow">
                    <div className="userAvatar">
                        <img src="" alt="" />
                    </div>
                    <span>{friend.userName}</span>

                </div>
            </div>
          ) : (
            <div className="emptyFriendInfo"></div>
          )}
        </div>
      );
      break;
    default:
      break;
  }

  return (
    <div className="profileModal">
      <div className="profileModal-backgroundDrop" />
      <div
        className="profileModal-layer"
        ref={modalRef}
        onClick={(e) => modalOutsideClick(e)}
      >
        <div className="profileModal-modal">
          <div className="profileModal-modal-container">
            <div className="profileModal-modal-wrapper">
              <div className="profileModal-contents">
                <section className="profileInterface">
                  <div className="header">
                    <div className="top">
                      <header className="banner">
                        <div className="fill" />
                      </header>
                      <div className="absoluteUserAvatar">
                        <div className="imgWrap">
                          <img src={friend.avatar} alt="" />
                          <div className="status-fill" />
                        </div>
                      </div>
                      <div className="absoluteServiceContainer">
                        <div className="empty" />
                        <div className="services">
                          <button>메시지 보내기</button>
                          <MoreVert />
                        </div>
                      </div>
                    </div>
                    <div className="bottom">
                      <div className="wrapper">
                        <div className="userInfo">
                          <h2>{friend.userName}</h2>
                          <p>
                            {friend.userName}#{friend.tag}
                          </p>
                        </div>
                        <div className="selectSection">
                          <div className="selectWrap">
                            <div className="text">
                              <div
                                className="textWrap"
                                onClick={() => setCurrentMoreInfo(0)}
                              >
                                <span>사용자 정보</span>
                              </div>
                              <div
                                className="textWrap"
                                onClick={() => setCurrentMoreInfo(1)}
                              >
                                <span>최근 게시물</span>
                              </div>
                              <div
                                className="textWrap"
                                onClick={() => setCurrentMoreInfo(2)}
                              >
                                <span>같이 있는 서버</span>
                              </div>
                              <div
                                className="textWrap"
                                onClick={() => setCurrentMoreInfo(3)}
                              >
                                <span>같이 아는 친구</span>
                              </div>
                            </div>
                            <hr />
                          </div>
                        </div>
                        <div className="moreInfo">{moreInfo}</div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
