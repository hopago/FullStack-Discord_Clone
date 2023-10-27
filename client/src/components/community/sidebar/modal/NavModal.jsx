import './navModal.scss';
import CampaignIcon from '@mui/icons-material/Campaign';

const NavModal = ({ modalRef, modalOutsideClick }) => {
  return (
    <div className="navModal">
        <div className="navModal-backgroundDrop" />
        <div className="navModal-layer" ref={modalRef} onClick={e => modalOutsideClick(e)}>
            <div className="navModal-modal">
                <div className="navModal-modal-container">
                    <div className="navModal-modal-wrapper">
                        <div className="navModal-contents">
                            <input type="text" placeholder='어디로 가고 싶은가요?' />
                            <div className="navModal-myServer">
                                <p>이전 채널</p>
                                <div className="navModal-latestServer">
                                    <CampaignIcon style={{ color: "#b5bac1"}} />
                                    <div className="navModal-texts">
                                        <span>ServerName</span>
                                    </div>
                                    <div className="navModal-category">
                                        <span>Category</span>
                                    </div>
                                </div>
                            </div>
                            <div className="navModal-announcement">
                                <span>참고:</span>
                                <div className="texts">
                                    <span>@, #, !</span>
                                    <span>(으)로 검색해 검색 결과를 좁혀보세요</span>
                                    <span className='navModal-learnMore'>더 알아보기</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NavModal;
