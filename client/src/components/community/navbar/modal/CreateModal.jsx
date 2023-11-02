import './createModal.scss';
import { useState } from 'react';
import Inputs from './Inputs';

const CreateModal = ({ modalRef, modalOutsideClick }) => {
    const [currPage, setCurrPage] = useState(0);

  return (
    <div className="serverModal">
        <div className="serverModal-backgroundDrop" />
        <div className="serverModal-layer" ref={modalRef} onClick={e => modalOutsideClick(e)}>
            <div className="serverModal-modal">
                <div className="serverModal-modal-container">
                    <div className="serverModal-modal-wrapper">
                        <div className="serverModal-contents">
                            <Inputs currPage={currPage} setCurrPage={setCurrPage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateModal;
