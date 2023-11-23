import "./sendFriendForm.scss";
import emptyBanner from "./assets/bca918618b884a382ab5.svg";
import { useState } from "react";

const SendFriendForm = () => {
  const [showFetchState, setShowFetchState] = useState(
    "친구 요청을 기다리는 중 이에요..."
  );
  const [receiver, setReceiver] = useState({
    userName: "",
    tag: "",
  });

  const handleAddFriend = (e) => {
    e.preventDefault();

    
  };

  const canSubmit = Boolean(
    receiver.userName !== "" && receiver.tag.length === 4
  );

  return (
    <section className="sendFriendForm-container">
      <header className="sendFriendForm">
        <h2>친구 추가하기</h2>
        <p>DevBoard의 사용자명과 태그를 사용하여 친구를 추가할 수 있어요.</p>
        <div className="inputForm">
          <form className="inputWrap" onSubmit={handleAddFriend}>
            <input
              type="text"
              placeholder="사용자명과 태그로 친구를 추가할 수 있어요"
            />
            <button disabled={!canSubmit}>친구 요청 보내기</button>
          </form>
        </div>
      </header>
      <div className="empty">
        <div className="wrapper">
          <div className="imgWrap">
            <img src={emptyBanner} alt="" />
          </div>
          <div className="textWrap">
            <span>{showFetchState}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SendFriendForm;
