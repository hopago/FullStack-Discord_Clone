import './base.scss';
import SideBar from '../sidebar/SideBar'
import { Route, Routes, useParams } from 'react-router-dom';
import Friend from '../main/components/friend/Friend';
import Server from '../main/components/server/Server';
import Forum from '../main/components/forum/Forum';
import Conversation from '../main/components/conversation/Conversation';
import UserServer from '../main/components/userServer/UserServer';

const Base = () => {
  const params = useParams();
  const pathName = Object.values(params)[0];

  return (
    <div className="community-base">
      <div className="community-content">
        {/* SideBar // 친구 포럼 서버 */}
        <SideBar type={pathName} />
        {/* Main */}
        <Routes>
          <Route path="/" element={<Friend />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/server" element={<Server />} />
          <Route path="/conversation/:friendId" element={<Conversation />} />
          <Route path="/server/:serverId" element={<UserServer />} />
          <Route path="/profile/:userId" element={{/* UserProfile */}} />
        </Routes>
      </div>
    </div>
  );
}

export default Base

