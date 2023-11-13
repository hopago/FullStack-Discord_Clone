import { useSelector } from "react-redux";
import ReactionButtons from "../reactionButtons/ReactionButtons";
import Spinner from "../../../../../../../lib/react-loader-spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { selectCurrentUser } from "../../../../../../../features/users/slice/userSlice";
import { useRef, useState } from "react";
import EditPost from "./components/EditPost";
import { useGetPostQuery } from "../../../../../../../features/post/slice/postsApiSlice";
import "moment/locale/ko";
import defaultAvatar from "../../../../assets/default-profile-pic-e1513291410505.jpg";
import logo from "../../../../../../home/navbar/assets/free-icon-computer-settings-2888694.png";
import {
  Close,
  Help,
  ModeComment,
  MoreVert,
  Notifications,
  Public,
  ThumbUp,
} from "@mui/icons-material";
import "./singlePost.scss";
import { useFindUserByIdQuery } from "../../../../../../../features/users/slice/usersApiSlice";
import AddComment from "./modals/AddComment";
import MoreVertical from "./components/MoreVertical";
import { setTime } from "../../../../../../../lib/moment/timeAgo";
import { useGetCommentsLengthQuery } from "../../../../../../../features/comments/slice/commentsApiSlice";

const SinglePost = () => {
  {
    /* Update or delete -> firebase url edit */
  }

  const userBackGroundImg = false;

  const currentUser = useSelector(selectCurrentUser);

  const { postId } = useParams();
  const navigate = useNavigate();

  const [showMoreVert, setShowMoreVert] = useState(false);

  const {
    data: post,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostQuery(postId);

  const {
    data
  } = useGetCommentsLengthQuery(postId);

  const authorId = post?.author.authorId;

  const { data: author } = useFindUserByIdQuery(authorId);

  const modalRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const modalOutsideClick = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const commentModalRef = useRef();
  const [showCommentForm, setShowCommentForm] = useState(false);

  const commentModalOutsideClick = (e) => {
    if (commentModalRef.current === e.target) {
      setShowCommentForm(false);
    }
  };

  if (isLoading) {
    return (
      <section>
        <Spinner message="컨텐츠를 기다리는 중 이에요..." />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="singlePost-Spinner">
        <Spinner message="컨텐츠를 찾지 못했어요." />
        <p>{error}</p>
      </section>
    );
  }

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
          <div className="singlePost-content-container">
            <div className="singlePost-content-LeftWrapper">
              <div className="contents-container">
                <div className="contents-wrapper">
                  <article className="singlePost-content">
                    <div className="top">
                      <div className="topImgWrapper">
                        <img
                          src={author?.avatar ? author?.avatar : defaultAvatar}
                          alt=""
                        />
                      </div>
                      <div className="row-center">
                        <span>{author?.userName}</span>
                        <div className="singlePost_time">
                          {setTime(post.createdAt, post.updatedAt)}
                          <Public fontSize="13px" />
                        </div>
                      </div>
                      <div className="row-right">
                        <MoreVert
                          onClick={() => setShowMoreVert((prev) => !prev)}
                          className="top-right-icon"
                        />
                        {showMoreVert && (
                          <MoreVertical
                            setShowModal={setShowModal}
                            currentUser={currentUser}
                            author={author}
                            setShowMoreVert={setShowMoreVert}
                          />
                        )}
                        <Close
                          onMouseEnter={() => setShowMoreVert(false)}
                          onClick={() =>
                            navigate("/community/forum", { replace: true })
                          }
                          className="top-right-icon"
                        />
                      </div>
                    </div>
                    <div className="center">
                      <div className="postBody" onMouseEnter={() => setShowMoreVert(false)}>
                        <div className="postBody_text">
                          <span>{post.description}</span>
                        </div>
                        <div className="postBody_img">
                          <img src={post.imgUrl} alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="bottom">
                      <div className="wrapper">
                        <div className="col-up">
                          <div className="buttonsWrapper">
                            <ReactionButtons post={post} />
                          </div>
                          <div className="col-up-texts" onClick={() => setShowCommentForm(true)}>
                            <span>{data?.length && `댓글 ${data?.length}개`}</span>
                          </div>
                        </div>
                        <div className="col-down">
                          <div className="addLike">
                            <ThumbUp fontSize="20px" />
                            <span>좋아요</span>
                          </div>
                          <div
                            className="addComment"
                            onClick={() => setShowCommentForm((prev) => !prev)}
                          >
                            <ModeComment fontSize="20px" />
                            <span>댓글 달기</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {showCommentForm && (
                      <AddComment
                        setShowCommentForm={setShowCommentForm}
                        modalRef={commentModalRef}
                        modalOutsideClick={commentModalOutsideClick}
                        post={post}
                        currentUser={currentUser}
                        length={data?.length}
                      />
                    )}
                  </article>
                </div>
              </div>
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
                    {author?.avatar ? (
                      <img src={author?.avatar} className="profileImg" alt={author?.avatar} />
                    ) : (
                      <img src={defaultAvatar} alt="default-pp" />
                    )}
                    <div className="roleImgWrapper">
                      <img
                        src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png"
                        className="roleImg"
                        alt={author?.language}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="profilePanel-userInfo">
                <div className="profilePanel-userInfo-wrapper">
                  <div className="top">
                    <div className="userText">
                      <h4>{author?.userName}</h4>
                      <p>
                        <strong>Stack</strong> {author?.language?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <hr className="userInfo-divider" />
                  <div className="center">
                    <span>내 소개</span>
                    <p>
                      {author?.description ??
                        "아직 소개글을 작성하지 않았어요."}
                    </p>
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
        {showModal && (
          <EditPost
            setShowModal={setShowModal}
            modalRef={modalRef}
            modalOutsideClick={modalOutsideClick}
            currPost={post}
          />
        )}
      </>
    )
  );
};

export default SinglePost;
