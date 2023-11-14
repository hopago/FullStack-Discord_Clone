import "./editPost.scss";

import EditPostEditor from "./EditPostEditor";

const EditPost = ({
  modalRef,
  setShowModal,
  currPost,
}) => {
  const modalContents = (
    <section className="createPost">
      <div className="createPost-flexVertical">
        <h2>게시글 수정</h2>
        <p>모든 영역을 다 채워야 업로드가 가능해요!</p>
      </div>
      <div className="createPost-content">
        <EditPostEditor 
          post={currPost}
          setShowModal={setShowModal}
        />
      </div>
    </section>
  );

  return (
    <div className="postModal">
      <div className="postModal-backgroundDrop" />
      <div
        className="postModal-layer"
        ref={modalRef}
      >
        <div className="postModal-modal">
          <div className="postModal-modal-container">
            <div className="postModal-modal-wrapper">
              <div className="postModal-contents">{modalContents}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
