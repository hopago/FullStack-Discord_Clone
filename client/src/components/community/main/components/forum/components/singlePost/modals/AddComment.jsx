import { Close, Send } from '@mui/icons-material';
import React from 'react'

const AddComment = ({
  setShowCommentForm: setShowModal,
  commentModalRef: modalRef,
  commentModalOutsideClick: modalOutsideClick,
}) => {


    const modalContents = (
        <section className="createPost">
          <div className="createPost-flexVertical">
            <form>
              <div className="buttons">
                <button onClick={() => setShowModal(false)}><Close /></button>
                <button><Send /></button>
              </div>
            </form>
          </div>
        </section>
      );
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
        </div>;

  return modalContents;
};

export default AddComment
