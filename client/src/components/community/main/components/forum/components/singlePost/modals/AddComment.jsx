import {
  ArrowDropDown,
  CancelOutlined,
  Close,
  Edit,
  EmojiEmotions,
  Gif,
  MoreVert,
  PhotoCamera,
  Public,
  Send,
} from "@mui/icons-material";
import React, { useRef, useState } from "react";
import "./addComment.scss";
import ReactionButtons from "../../reactionButtons/ReactionButtons";
import { useFindUserByIdQuery } from "../../../../../../../../features/users/slice/usersApiSlice";
import {
  useAddCommentMutation,
  useGetCommentsQuery,
  useLikeCommentMutation,
  useReplyCommentMutation,
} from "../../../../../../../../features/comments/slice/commentsApiSlice";
import { timeAgoFromNow } from "../../../../../../../../lib/moment/timeAgo";

const AddComment = ({
  setShowCommentForm: setShowModal,
  modalRef,
  modalOutsideClick,
  post,
  currentUser,
  length,
}) => {
  const postId = post._id;

  const [fetchType, setFetchType] = useState("latest");
  const [fetchCount, setFetchCount] = useState(0);

  const params = {
    fetchType,
    fetchCount,
    postId,
  };

  const { data: author } = useFindUserByIdQuery(post.author.authorId);

  const { data, isLoading, isSuccess, isError, error } =
    useGetCommentsQuery(params);

  const [showCommentEditMoreVertIcon, setShowCommentEditMoreVertIcon] =
    useState(false);
  const [currentCommentId, setCurrentCommentId] = useState("");
  const [editComment, setEditComment] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [description, setDescription] = useState("");
  const [showVerticalOptions, setShowVerticalOptions] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState("");

  const inputRef = useRef();

  const [addComment] = useAddCommentMutation();

  const handleClick = () => {
    if (Boolean(description)) {
      addComment({
        description,
        postId,
      }).unwrap();

      setDescription("");
    }
  };

  const closeEditState = () => {
    setShowCommentEditMoreVertIcon(false);
    setCurrentCommentId("");
    setEditComment(false);
    setUpdatedDescription("");
    setShowVerticalOptions(false);
    setSelectedCommentId("");
  };

  const [addLike] = useLikeCommentMutation();
  const [addReply] = useReplyCommentMutation();

  const handleCommentLike = (_id) => {
    const commentId = _id;

    addLike({
      commentId,
      currentUserId: currentUser._id,
      ...params,
    }).unwrap();

    setCurrentCommentId("");
  };

  const handleCommentReply = (_id) => {
    const commentId = _id;

    addReply({
      commentId,
      description: updatedDescription,
    }).unwrap();

    setUpdatedDescription("");
  };

  const modalContents = (
    <section className="createComment">
      <div className="createComment-flexVertical">
        <div className="top">
          <div className="fill" />
          <h2>{post.author.userName}님의 게시물</h2>
          <div className="btnWrap">
            <button>
              <Close
                style={{ fontSize: "21px" }}
                onClick={() => setShowModal(false)}
              />
            </button>
          </div>
        </div>
        <hr />
        <div className="center">
          <div className="authorInfo">
            <div className="author">
              <img src={author?.avatar} alt="" />
              <div className="author_texts">
                <span>{post.author.userName}</span>
                <div className="moreInfo">
                  <span>
                    {post.updatedAt !== post.createdAt
                      ? timeAgoFromNow(post.updatedAt) + " (수정됨)"
                      : timeAgoFromNow(post.createdAt)}
                  </span>
                  <Public fontSize="12px" color="#bdb3b8" />
                </div>
              </div>
            </div>
            {author._id === currentUser._id && (
              <div className="moreVert">
                <MoreVert />
              </div>
            )}
          </div>
          <div className="postBody">
            <div className="postBody_text">
              <span>{post.description}</span>
            </div>
            <img src={post.imgUrl} alt="" />
          </div>
        </div>
        <div className="bottom">
          <div className="scroll">
            <div className="bottom-row-top">
              <ReactionButtons post={post} />
              <span>{length && `댓글 ${length.toString()}개`}</span>
            </div>
            <div className="bottom-row-bottom">
              <div className="filterOptions">
                <div className="fill" />
                <div className="filterOption">
                  <div className="list">
                    <div
                      className="firstChild"
                      onClick={() => setFetchType("latest")}
                    >
                      <div className="fetchCount">
                        {length > 11 && (
                          <span
                            onClick={() => setFetchCount((prev) => prev + 1)}
                          >
                            댓글 더보기
                          </span>
                        )}
                      </div>
                      <div className="filterOpt">
                        <span>최신순</span>
                        <ArrowDropDown
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setShowVerticalOptions((prev) => !prev)
                          }
                        />
                      </div>
                    </div>
                    {showVerticalOptions && (
                      <div className="absoluteBox">
                        <div
                          className="filterTextWrap"
                          onClick={() => setFetchType("related")}
                        >
                          <span>관련성 높은 순</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* fetch point */}
              <div className="comment_scrollWrap">
                {isSuccess &&
                  data.map((data) => (
                    <ul key={data._id}>
                      <li>
                        <div className="commentWrap">
                          <div className="userProfile">
                            <img
                              src={data?.comments[0]?.author?.avatar}
                              alt=""
                            />
                          </div>
                          <div className="comment">
                            <div
                              className="comment-top"
                              onMouseEnter={() => {
                                setShowCommentEditMoreVertIcon(true);
                                setCurrentCommentId(data?._id);
                              }}
                              onMouseLeave={() => {
                                setShowCommentEditMoreVertIcon(false);
                                setCurrentCommentId("");
                              }}
                            >
                              <div className="wrap">
                                <span className="comment_userName">
                                  {data?.comments[0]?.author?.userName}
                                </span>
                                {editComment &&
                                selectedCommentId === data?._id ? (
                                  <input
                                    autoFocus
                                    ref={inputRef}
                                    style={{
                                      width: `${
                                        data?.comments[0]?.description.length *
                                        9
                                      }px`,
                                    }}
                                    className="comment-description-edit"
                                    type="text"
                                    value={updatedDescription}
                                    onChange={(e) => {
                                      setUpdatedDescription(e.target.value);
                                    }}
                                  />
                                ) : (
                                  <p className="comment-description">
                                    {data?.comments[0]?.description}
                                  </p>
                                )}
                                {showCommentEditMoreVertIcon &&
                                  data?.comments[0]?.author.authorId ===
                                    currentUser._id &&
                                  currentCommentId === data?._id && (
                                    <div className="commentEdit">
                                      {showCommentEditMoreVertIcon &&
                                      !editComment ? (
                                        <Edit
                                          fontSize="15px"
                                          onClick={() => {
                                            setEditComment(true);
                                            setSelectedCommentId(data?._id);
                                            setUpdatedDescription(
                                              data?.comments[0]?.description
                                            );

                                            if (inputRef.current !== null) {
                                              inputRef.current.focus();
                                            }
                                          }}
                                        />
                                      ) : (
                                        selectedCommentId === data?._id && (
                                          <section className="editIcons">
                                            <Send
                                              fontSize="15px"
                                              onClick={() => {}}
                                              className="update_icon"
                                            />
                                            <CancelOutlined
                                              className="cancel_icon"
                                              onClick={closeEditState}
                                            />
                                          </section>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                            <div className="comment-bottom">
                              <div className="flexWrap">
                                <span
                                  onClick={() => {
                                    setFetchType("latest");
                                    handleCommentLike(data);
                                  }}
                                >
                                  {!data?.comments[0].comment_like_count.includes(
                                    currentUser._id
                                  )
                                    ? "좋아요"
                                    : `좋아요 ${data?.comments[0].comment_like_count.length}개`}
                                </span>
                                <span
                                  onClick={() => handleCommentReply(data._id)}
                                >
                                  답글 달기
                                </span>
                                <span>{timeAgoFromNow(data.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  ))}
              </div>
              <div className="commentForm">
                <div className="leftWrap">
                  <div className="innerYWrap">
                    <div className="form_flexRow">
                      <img src={currentUser.avatar} alt="" />
                      <form>
                        <div className="commentInput_top">
                          <div className="inputWrap">
                            <input
                              type="text"
                              placeholder="댓글을 입력하세요..."
                              autoComplete="off"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="commentInput_bottom">
                          <div className="icons">
                            <EmojiEmotions />
                            <PhotoCamera />
                            <Gif />
                          </div>
                          <Send
                            onClick={handleClick}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="commentModal">
      <div className="commentModal-backgroundDrop" />
      <div
        className="commentModal-layer"
        ref={modalRef}
        onClick={(e) => modalOutsideClick(e)}
      >
        <div className="commentModal-modal">
          <div className="commentModal-modal-container">
            <div className="commentModal-modal-wrapper">
              <div className="commentModal-contents">{modalContents}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComment;
