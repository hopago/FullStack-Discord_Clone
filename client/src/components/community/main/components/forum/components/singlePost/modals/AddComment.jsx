import {
  ArrowDropDown,
  CancelOutlined,
  Close,
  Delete,
  Edit,
  EmojiEmotions,
  Gif,
  MoreVert,
  PhotoCamera,
  Public,
  Send,
  Shortcut,
} from "@mui/icons-material";
import React, { useRef, useState } from "react";
import "./addComment.scss";
import ReactionButtons from "../../reactionButtons/ReactionButtons";
import { useFindUserByIdQuery } from "../../../../../../../../features/users/slice/usersApiSlice";
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useDeleteReplyCommentMutation,
  useGetCommentsQuery,
  useLikeCommentMutation,
  useReplyCommentMutation,
  useUpdateCommentMutation,
  useUpdateReplyCommentMutation,
} from "../../../../../../../../features/comments/slice/commentsApiSlice";
import { timeAgoFromNow } from "../../../../../../../../lib/moment/timeAgo";
import DOMPurify from "isomorphic-dompurify";

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

  const { data, isSuccess, isError } = useGetCommentsQuery(params);

  const [showCommentEditMoreVertIcon, setShowCommentEditMoreVertIcon] =
    useState(false);
  const [currentCommentId, setCurrentCommentId] = useState("");
  const [description, setDescription] = useState("");
  const [editComment, setEditComment] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [replyDescription, setReplyDescription] = useState("");
  const [showVerticalOptions, setShowVerticalOptions] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState("");

  const inputRef = useRef();

  const [addComment] = useAddCommentMutation();

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (Boolean(description)) {
      const res = await addComment({
        description,
        postId,
      });

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
  const [updateComment] = useUpdateCommentMutation();
  const [addReply] = useReplyCommentMutation();
  const [updateReply] = useUpdateReplyCommentMutation();
  const [deleteReply] = useDeleteReplyCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplyComment, setShowReplyComment] = useState(false);
  const [showReplyEditIcons, setShowReplyEditIcons] = useState(false);
  const [editCommentReply, setEditCommentReply] = useState(false);
  const [updatedReplyDescription, setUpdatedReplyDescription] = useState("");
  const [identifierDesc, setIdentifierDesc] = useState("");

  const closeReplyState = () => {
    setUpdatedReplyDescription("");
    setShowReplyEditIcons(false);
    setEditCommentReply(false);
  };

  const handleCommentDelete = (_id) => {
    const commentId = _id;

    deleteComment(commentId).unwrap();
  };

  const handleCommentLike = (_id) => {
    const commentId = _id;

    addLike({
      commentId,
      currentUserId: currentUser._id,
      ...params,
    }).unwrap();

    setCurrentCommentId("");
  };

  const handleCommentUpdate = (_id) => {
    const commentId = _id;

    updateComment({
      commentId,
      description: updatedDescription,
    }).unwrap();

    setUpdatedDescription("");
    closeEditState();
  };

  const handleCommentReply = (_id) => {
    const commentId = _id;

    const isValid = Boolean(replyDescription);

    isValid &&
      addReply({
        commentId,
        description: replyDescription,
      }).unwrap();

    setReplyDescription("");
    setShowReplyForm(false);
    setShowReplyComment(true);
  };

  const handleCommentReplyUpdate = (commentId, originDesc) => {
    const description = updatedReplyDescription;
    const originDescription = originDesc;

    updateReply({ commentId, description, originDescription }).unwrap();

    setUpdatedDescription("");
    closeReplyState();
  };

  const handleCommentReplyDelete = (_id, currentDescription) => {
    const commentId = _id;
    const description = currentDescription;

    deleteReply({ commentId, description }).unwrap();
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
            {author?._id === currentUser?._id && (
              <div className="moreVert">
                <MoreVert />
              </div>
            )}
          </div>
          <div className="postBody">
            <div
              className="view ql-editor"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post?.description),
              }}
            />
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
                {isError ? (
                  <span>데이터를 불러오지 못했어요...</span>
                ) : (
                  isSuccess &&
                  Array.isArray(data) &&
                  data.length &&
                  data?.map((data) => (
                    <ul key={data._id}>
                      <li>
                        <div className="commentWrap">
                          <div className="userProfile">
                            <img
                              src={data?.comments?.[0]?.author?.avatar}
                              alt=""
                            />
                          </div>
                          <div className="comment">
                            <div
                              className="comment-top"
                              onMouseEnter={() => {
                                setShowCommentEditMoreVertIcon(true);
                                if (showReplyForm) {
                                  return;
                                } else {
                                  setCurrentCommentId(data?._id);
                                }
                              }}
                              onMouseLeave={() => {
                                setShowCommentEditMoreVertIcon(false);
                                if (showReplyForm) {
                                  return;
                                } else {
                                  setCurrentCommentId("");
                                }
                              }}
                            >
                              <div className="wrap">
                                <span className="comment_userName">
                                  {data?.comments?.[0]?.author?.userName}
                                </span>
                                {editComment &&
                                selectedCommentId === data?._id ? (
                                  <input
                                    autoFocus
                                    ref={inputRef}
                                    style={{
                                      width: `${
                                        data?.comments?.[0]?.description
                                          .length * 7
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
                                    {data?.comments?.[0]?.description}
                                  </p>
                                )}
                                {showCommentEditMoreVertIcon &&
                                  data?.comments?.[0]?.author.authorId ===
                                    currentUser._id &&
                                  currentCommentId === data?._id && (
                                    <div className="commentEdit">
                                      {showCommentEditMoreVertIcon &&
                                      !editComment &&
                                      !showReplyForm ? (
                                        <>
                                          <Edit
                                            style={{
                                              marginRight: "3px",
                                              fontSize: "15px",
                                            }}
                                            onClick={() => {
                                              setEditComment(true);
                                              setSelectedCommentId(data?._id);
                                              setUpdatedDescription(
                                                data?.comments?.[0]?.description
                                              );

                                              if (inputRef.current !== null) {
                                                inputRef.current.focus();
                                              }
                                            }}
                                          />
                                          <Delete
                                            fontSize="12px"
                                            onClick={() =>
                                              handleCommentDelete(data?._id)
                                            }
                                          />
                                        </>
                                      ) : (
                                        selectedCommentId === data?._id && (
                                          <section className="editIcons">
                                            <Send
                                              style={{ fontSize: "15px" }}
                                              onClick={() =>
                                                handleCommentUpdate(data?._id)
                                              }
                                              className="update_icon"
                                            />
                                            <CancelOutlined
                                              style={{ fontSize: "18px" }}
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
                                <div className="verticalWrapper">
                                  <div className="top_span">
                                    <span
                                      onClick={() => {
                                        setFetchType("latest");
                                        handleCommentLike(data?._id);
                                      }}
                                    >
                                      {!data?.comments?.[0].comment_like_count.includes(
                                        currentUser._id
                                      )
                                        ? "좋아요"
                                        : `좋아요 ${data?.comments?.[0].comment_like_count.length}개`}
                                    </span>
                                    <span
                                      onClick={() => {
                                        if (currentCommentId === data?._id) {
                                          setCurrentCommentId("");
                                        } else {
                                          setCurrentCommentId(data?._id);
                                        }
                                        setShowReplyForm((prev) => !prev);
                                      }}
                                    >
                                      답글 달기
                                    </span>
                                    <span>
                                      {timeAgoFromNow(data.createdAt)}
                                    </span>
                                  </div>
                                  {showReplyForm &&
                                    currentCommentId === data?._id && (
                                      <div className="replyForm">
                                        <div className="replyForm_flexRow">
                                          <img
                                            src={currentUser.avatar}
                                            alt=""
                                          />
                                          <div className="replyForm_vertical">
                                            <div className="vertical_container">
                                              <div className="vertical_wrapper">
                                                <input
                                                  type="text"
                                                  onChange={(e) =>
                                                    setReplyDescription(
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder="답글을 입력하세요..."
                                                />
                                                <div className="commentInput_bottom">
                                                  <div className="icons">
                                                    <EmojiEmotions />
                                                    <PhotoCamera />
                                                    <Gif />
                                                  </div>
                                                  <Send
                                                    onClick={() =>
                                                      handleCommentReply(
                                                        data?._id
                                                      )
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  {Array.isArray(
                                    data?.comments?.[0].comment_reply
                                  ) &&
                                    Boolean(
                                      data?.comments?.[0].comment_reply.length
                                    ) && (
                                      <div className="bottom_span">
                                        <span>
                                          <Shortcut
                                            style={{ fontSize: "15px" }}
                                            className="shortCut"
                                          />
                                        </span>
                                        <span
                                          onClick={() =>
                                            setShowReplyComment((prev) => !prev)
                                          }
                                        >
                                          답글{" "}
                                          {
                                            data?.comments?.[0].comment_reply
                                              .length
                                          }
                                          개
                                        </span>
                                      </div>
                                    )}
                                </div>
                                {showReplyComment &&
                                  data?.comments?.[0].comment_reply?.map(
                                    (reply) => (
                                      <div
                                        className="commentReply_container"
                                        onMouseEnter={() => {
                                          if (editCommentReply) {
                                            return;
                                          } else {
                                            setIdentifierDesc(
                                              reply.description
                                            );
                                            setShowReplyEditIcons(true);
                                          }
                                        }}
                                        onMouseLeave={() => {
                                          if (editCommentReply) {
                                            return;
                                          } else {
                                            setIdentifierDesc(
                                              reply.description
                                            );
                                            setShowReplyEditIcons(false);
                                          }
                                        }}
                                      >
                                        <div className="commentReply_wrapper">
                                          <div className="commentReply_row">
                                            <img
                                              src={reply.user.avatar}
                                              alt=""
                                            />
                                            <div className="commentReply_vertical">
                                              <span>{reply.user.userName}</span>
                                              {editCommentReply &&
                                              identifierDesc ===
                                                reply.description ? (
                                                <input
                                                  autoFocus
                                                  ref={inputRef}
                                                  style={{
                                                    width: `${
                                                      reply.description.length *
                                                      7
                                                    }px`,
                                                  }}
                                                  type="text"
                                                  value={
                                                    updatedReplyDescription
                                                  }
                                                  onChange={(e) =>
                                                    setUpdatedReplyDescription(
                                                      e.target.value
                                                    )
                                                  }
                                                  className="reply_edit_input"
                                                />
                                              ) : (
                                                <p>{reply.description}</p>
                                              )}
                                            </div>
                                          </div>
                                          <div className="commentReply_vertical_row">
                                            <span>
                                              {reply.updatedAt !==
                                              reply.createdAt
                                                ? timeAgoFromNow(
                                                    reply.updatedAt
                                                  ) + " (수정됨)"
                                                : timeAgoFromNow(
                                                    reply.createdAt
                                                  )}
                                            </span>
                                            <span>좋아요</span>
                                          </div>
                                          {showReplyEditIcons &&
                                            currentUser._id ===
                                              reply.user.userId &&
                                            reply.description ===
                                              identifierDesc && (
                                              <div className="reply_icons_wrapper">
                                                {!editCommentReply ? (
                                                  <Edit
                                                    style={{
                                                      marginRight: "3px",
                                                      fontSize: "15px",
                                                    }}
                                                    onClick={() => {
                                                      setUpdatedReplyDescription(
                                                        reply.description
                                                      );
                                                      setEditCommentReply(true);
                                                    }}
                                                    className="reply_update"
                                                  />
                                                ) : (
                                                  <Send
                                                    style={{
                                                      marginRight: "3px",
                                                      fontSize: "15px",
                                                    }}
                                                    onClick={() =>
                                                      handleCommentReplyUpdate(
                                                        data._id,
                                                        reply.description
                                                      )
                                                    }
                                                    className="reply_update"
                                                  />
                                                )}
                                                {!editCommentReply ? (
                                                  <Delete
                                                    fontSize="15px"
                                                    onClick={() =>
                                                      handleCommentReplyDelete(
                                                        data?._id,
                                                        reply?.description
                                                      )
                                                    }
                                                    className="reply_delete"
                                                  />
                                                ) : (
                                                  <CancelOutlined
                                                    fontSize="15px"
                                                    onClick={closeReplyState}
                                                    className="reply_delete"
                                                  />
                                                )}
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    )
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  ))
                )}
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
                            onClick={handleAddComment}
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