import { useSelector } from 'react-redux';
import ReactionButtons from '../reactionButtons/ReactionButtons';
import Spinner from '../../../../../../../lib/react-loader-spinner/Spinner';
import { useParams } from 'react-router-dom';
import { selectCurrentUser } from '../../../../../../../features/users/slice/userSlice';
import {  useRef, useState } from 'react';
import EditPost from './components/EditPost';
import { useGetPostQuery } from '../../../../../../../features/post/slice/postsApiSlice';
import moment from 'moment';
import 'moment/locale/ko';
import defaultAvatar from '../../../../assets/default-profile-pic-e1513291410505.jpg';
import logo from '../../../../../../home/navbar/assets/free-icon-computer-settings-2888694.png';
import { Help, Notifications } from '@mui/icons-material';
import './singlePost.scss';

const SinglePost = () => {
  const userBackGroundImg = false; 
  const userProfilePicture = false;

  const { postId } = useParams();
  const { _id } = useSelector(state => selectCurrentUser(state));

  const {
    data: post,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostQuery(postId);

  const modalRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const modalOutsideClick = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  if (isLoading) {
    return (
      <section>
        <Spinner message="컨텐츠를 기다리는 중 이에요..." />
      </section>
    )
  }

  if (isError) {
    return (
        <section className='singlePost-Spinner'>
            <Spinner message="컨텐츠를 찾지 못했어요." />
            <p>{error}</p>
        </section>
    );
  }

  const setTime = (createdAt, updatedAt) => {
    if (createdAt !== updatedAt) {
      return moment.utc(updatedAt).lang("ko").format('YYYY년 MMMM Do dddd') + "(수정됨)";
    } else {
      return moment.utc(createdAt).lang("ko").format('YYYY년 MMMM Do dddd');
    }
  };

  return (
    isSuccess && (
      <>
        <div className="forum-singlePost">
          <section className="forum-nav">
            <div className="forum-nav-wrapper">
              <div className="forum-nav-left">
                <img src={logo} alt="" />
                <h1>DevBoard</h1>
                <span>게시판</span>
              </div>
              <div className="forum-nav-right">
                <div className="forum-nav-right-iconWrapper">
                  <Notifications />
                </div>
                <div className="forum-nav-right-iconWrapper">
                  <Help />
                </div>
              </div>
            </div>
          </section>
          <hr />
          <div className="singlePost-Content-Container">
            <div className="singlePost-Content-LeftWrapper">
              <article className="singlePost-content">
                {post.author.authorId === _id && (
                  <button onClick={() => setShowModal(true)}>수정</button>
                )}
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <p className="postCredit">
                  {setTime(post.createdAt, post.updatedAt)}
                </p>
                <ReactionButtons post={post} />
                {showModal && (
                  <EditPost
                    setShowModal={setShowModal}
                    modalRef={modalRef}
                    modalOutsideClick={modalOutsideClick}
                    currPost={post}
                  />
                )}
              </article>
            </div>
            <div className="profilePanel">
              <div className="profilePanel-ImgContainer">
                <div className="wrapper">
                  {userBackGroundImg ? (
                    <img src="" alt="" className="background" />
                  ) : (
                    <div className="background-fill" />
                  )}
                  <div className="profilePictureWrapper">
                    {userProfilePicture ? (
                      <img src="" className="profileImg" />
                    ) : (
                      <img src={defaultAvatar} />
                    )}
                    <div className="roleImgWrapper">
                      <img
                        src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png"
                        className="roleImg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="profilePanel-userInfo">
                <div className="profilePanel-userInfo-wrapper">
                  <div className="top">
                    <div className="userText">
                      <h4>UserName</h4>
                      <p>UserRole</p>
                    </div>
                  </div>
                  <hr className="userInfo-divider" />
                  <div className="center">
                    <span>내 소개</span>
                    <p>User Description</p>
                  </div>
                  <hr className="userInfo-divider" />
                  <div className="bottom">
                    <span>최근 게시글</span>
                    <p>Post Title</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
}

export default SinglePost
