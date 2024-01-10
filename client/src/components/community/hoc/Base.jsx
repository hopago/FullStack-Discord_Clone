import './base.scss';
import SideBar from '../sidebar/SideBar'
import { Route, Routes, useParams } from 'react-router-dom';
import Friend from '../main/components/friend/Friend';
import Server from '../main/components/server/Server';
import Forum from '../main/components/forum/Forum';
import Conversation from '../main/components/conversation/Conversation';
import UserServer from '../main/components/userServer/UserServer';
import SinglePost from '../main/components/forum/components/singlePost/SinglePost';

const Base = () => {
  const params = useParams();
  const pathName = Object.values(params)[0];

  {/* 친구 데이터 fetch point */}

  return (
    <div className="community-base">
      <div className="community-content">
        {/* SideBar // 친구 포럼 서버 */}
        <SideBar type={pathName} />
        {/* Main */}
        <Routes>
          <Route path="/" element={<Friend />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:postId" element={<SinglePost />} />
          <Route path="/server" element={<Server />} />
          <Route path="/conversation/:conversationId" element={<Conversation />} />
          <Route path="/server/:serverId" element={<UserServer />} />
        </Routes>
      </div>
    </div>
  );
}

export default Base

