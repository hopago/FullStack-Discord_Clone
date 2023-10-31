import { serverResults } from "./constants"
import {
    Check,
    Favorite
} from '@mui/icons-material';
import './serverList.scss';

const ServerList = () => {
    {/* lazy fetching & memoization */}

  return (
    <div className="community-server-serverListCard">
      {/* server-data: title, desc, serverImg, liked, isVerified */}
      {serverResults.map((data) => (
        <div className="container">
          <div className="serverList-wrapper">
            <div className="header">
              <img src={data.img} alt="" />
            </div>
            <div className="serverInfo">
              <div className="title">{data.title}</div>
              <div className="desc">{data.desc}</div>
              <div className="serverStatusInfo">
                <div className="liked">
                  <Favorite style={{ color: "#E5271B", fontSize: "12px" }} />
                  {data.liked}
                </div>
                {data.isVerified && (
                  <div className="isVerified">
                    <Check style={{ color: "#23A559", fontSize: "12px" }} />
                    Verified
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ServerList
