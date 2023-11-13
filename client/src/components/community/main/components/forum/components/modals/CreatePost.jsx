import { useState } from "react";
import "./createPost.scss";
import CreatedEditor from "../../../../../../../lib/react-quill/CreatePost";

const CreatePost = ({ modalRef, modalOutsideClick, setShowModal }) => {
  const modalContents = (
    <section className="createPost">
      <div className="createPost-flexVertical">
        <h2>게시글 작성</h2>
        <p>모든 영역을 다 채워야 업로드가 가능해요!</p>
      </div>
      <div className="createPost-content">
        <CreatedEditor
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
        onClick={(e) => modalOutsideClick(e)}
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

export default CreatePost;
