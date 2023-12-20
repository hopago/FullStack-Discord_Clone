import { useAddBlackListMutation } from '../../../../../../../features/blackList/slice/blackListApiSlice';
import { useRemoveFriendMutation } from '../../../../../../../features/users/slice/usersApiSlice';
import './confirmModal.scss';

const ConfirmModal = ({
  modalRef,
  modalOutsideClick,
  friend,
  setShowConfirm,
  requestType
}) => {
    const [removeFriend] = useRemoveFriendMutation();
    const [blockFriend] = useAddBlackListMutation();
  
    const handleRemoveFriend = async () => {
        return await removeFriend(friend._id);
    };

    const handleBlockFriend = async () => {
        return await blockFriend(friend._id);
    };

    const handleRequest = () => {
        if (requestType === "삭제") {
            handleRemoveFriend();
        } else {
            handleBlockFriend();
        }
    };

  return (
    <div className="confirmModal">
      <div className="confirmModal-backgroundDrop" />
      <div
        className="confirmModal-layer"
        ref={modalRef}
        onClick={(e) => modalOutsideClick(e)}
      >
        <div className="confirmModal-modal">
          <div className="confirmModal-modal-container">
            <div className="confirmModal-modal-wrapper">
              <div className="confirmModal-contents">
                <div className="container">
                  <div className="flexCol">
                    <div className="main">
                      <h1>
                        {friend.userName}님을 {requestType}할까요?
                      </h1>
                    </div>
                    <div className="desc">
                      <p>
                        {requestType === "차단하기"
                          ? `정말 ${friend.userName}님을 차단할까요? 차단하시면 친구 목록에서 제거돼요.`
                          : `친구 ${friend.userName}님을 삭제하시겠어요?`}
                      </p>
                    </div>
                    <div className="buttons">
                      <div className="buttonWrapper">
                        <button
                          className="cancel"
                          onClick={() => setShowConfirm(false)}
                        >
                          취소
                        </button>
                        <button className="confirm" onClick={handleRequest}>
                          {requestType}하기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal