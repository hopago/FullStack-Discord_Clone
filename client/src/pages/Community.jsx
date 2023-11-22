import { Route, Routes } from 'react-router-dom';
import { 
    CommunityNavbar, 
    Base,
} from '../components';
import './scss/community.scss';
import { useGetCurrentUserQuery } from '../features/users/slice/usersApiSlice';
import Spinner from '../lib/react-loader-spinner/Spinner';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../features/users/slice/userSlice';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Community = () => {
  const dispatch = useDispatch();
  const {
    data: currentUser,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetCurrentUserQuery();

  if (currentUser) {
    dispatch(setCurrentUser(currentUser));
  }

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, [socket, currentUser]);

  useEffect(() => {
    socket.emit("activateUser", currentUser);
  }, [socket, currentUser]);

  let content;
  if (isLoading) {
    content = <Spinner message={"컨텐츠를 기다리는 중 이에요..."} />;
  } else if (isSuccess) {
    content = (
      <div className="community">
        <CommunityNavbar />
        <Routes>
          <Route path="/*" element={<Base />} />
        </Routes>
      </div>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>
  }

  return content;
}

export default Community
