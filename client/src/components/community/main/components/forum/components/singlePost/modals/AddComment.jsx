import { ArrowDropDown, Close, MoreVert, Public, Send } from "@mui/icons-material";
import React, { useState } from "react";
import "./addComment.scss";
import ReactionButtons from "../../reactionButtons/ReactionButtons";
import { useFindUserByIdQuery } from "../../../../../../../../features/users/slice/usersApiSlice";

const AddComment = ({
  setShowCommentForm: setShowModal,
  modalRef,
  modalOutsideClick,
  post,
}) => {
  const {
    data: author
  } = useFindUserByIdQuery(post.author.authorId);

  const [showVerticalOptions ,setShowVerticalOptions] = useState(false);

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
              <img src={author.avatar} alt="" />
              <div className="author_texts">
                <span>{post.author.userName}</span>
                <div className="moreInfo">
                  <span>2일전</span>
                  <Public fontSize="12px" color="#bdb3b8" />
                </div>
              </div>
            </div>
            <div className="moreVert">
              <MoreVert />
            </div>
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
              <span>댓글 2개</span>
            </div>
            <div className="bottom-row-bottom">
              <div className="filterOptions">
                <div className="fill" />
                <div className="filterOption">
                  <div className="list">
                    <div className="firstChild">
                      <span>최신순</span>
                      <ArrowDropDown
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowVerticalOptions((prev) => !prev)}
                      />
                    </div>
                    {showVerticalOptions && (
                      <div className="absoluteBox">
                        <div className="filterTextWrap">
                          <span>관련성 높은 순</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* fetch point */}
              <div className="comments_scrollWrap">
                <ul>
                  <li>
                    <div className="commentWrap">
                      <div className="userProfile">
                        <img src="" alt="" />
                      </div>
                      <div className="comment">
                        <div className="comment-top">
                          <div className="wrap">
                            <span className="comment_userName">
                              comment_userName
                            </span>
                            <p className="comment-description">
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Laboriosam eum beatae culpa debitis neque
                              similique, quisquam exercitationem illum nemo
                              alias voluptate? Expedita ipsam aliquid quis.
                            </p>
                          </div>
                        </div>
                        <div className="comment-bottom">
                          <div className="flexWrap">
                            <span>좋아요</span>
                            <span>답글 달기</span>
                            <span>createdAt</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
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
