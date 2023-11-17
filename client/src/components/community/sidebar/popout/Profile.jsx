import { timeAgoFromNow } from "../../../../lib/moment/timeAgo";
import ArrowRight from "../../navbar/assets/ArrowRight";
import DefaultBanner from "./banner/DefaultBanner";
import "./profile.scss";

const Profile = ({ currentUser }) => {
  return (
    <div className="accountProfile">
      <div className="wrapper">
        <DefaultBanner />
        <img id="popoutImg" src={currentUser.avatar} alt="" />
        <div className="userInfo">
          <div className="userInfoWrapper">
            <section className="top">
              <div className="col">
                <h2>{currentUser.userName}</h2>
                <p>{currentUser.language}</p>
              </div>
              <hr className="divider" />
            </section>
            <section className="center">
              <div className="description">
                <h2>내 소개</h2>
                <p>{currentUser.description}</p>
              </div>
              <div className="date">
                <h2>DEVBOARD 가입 시기:</h2>
                <p>{timeAgoFromNow(currentUser.createdAt)}</p>
              </div>
              <hr className="divider" />
            </section>
            <section className="bottom">
              <div className="row">
                <div className="fill" />
                <div className="grow">온라인</div>
                <ArrowRight />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
