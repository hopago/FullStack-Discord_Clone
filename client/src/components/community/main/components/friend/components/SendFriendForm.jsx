import "./sendFriendForm.scss";
import emptyBanner from "./assets/bca918618b884a382ab5.svg";
import { useState } from "react";
import { useCreateNotificationMutation, useSendFriendMutation } from "../../../../../../features/friends/slice/friendRequestApiSlice";
import { socket } from "../../../../../..";

const SendFriendForm = ({ currentUser }) => {
  const [showFetchState, setShowFetchState] = useState(
    "친구 요청을 기다리는 중 이에요..."
  );
  const [receiver, setReceiver] = useState({
    userName: "",
    tag: "",
  });
  const [isError, setIsError] = useState(false);

  const [sendFriend] = useSendFriendMutation();
  
  const [sendNotification] = useCreateNotificationMutation();

  const handleInput = (e) => {
    setIsError(false);
    const value = e.target.value;
    const [userName, tag] = value.split('#');

    setReceiver({
        userName,
        tag: Number(tag)
    });
  };

  const handleAddFriend = (e) => {
    e.preventDefault();

    const { userName, tag } = receiver;

    sendFriend({
        userName,
        tag
    })
    .unwrap()
    .then(async (data) => {
        await sendNotification({
          senderId: currentUser._id,
          type: "friendRequest_send",
          userName: currentUser.userName,
          tag: currentUser.tag
        });
        setShowFetchState("친구 요청을 성공적으로 보냈어요!");
        socket?.emit("sendNotification", {
          senderId: currentUser._id,
          receiverId: data.receiverId,
          requestType: "friendRequest_send",
          tag,
          userName
        });

        try {
            socket?.on("userNotFound", (res) => {
                if (res.status === 400) {
                    return () => {
                        socket.off("sendNotification");
                        socket.off("userNotFound");
                    }
                }
            });
        } catch (err) {
            console.error(`socket, userNotFound: ${err}`);
        }
    })
    .catch(err => {
        console.error(err);
        setIsError(true);
        setShowFetchState(`친구 요청을 보내지 못했어요.
        사용자명과 태그를 확인해주세요.
        `);
    })
  };

  const canSubmit = Boolean(
    receiver.userName !== "" && 100000 > receiver.tag > 9999
  );

  return (
    <section className="sendFriendForm-container">
      <header className="sendFriendForm">
        <h2>친구 추가하기</h2>
        <p>DevBoard의 사용자명과 태그를 사용하여 친구를 추가할 수 있어요.</p>
        <div
          className="inputForm"
          style={{ outline: `${isError && "1px solid #F23F42"}` }}
        >
          <form className="inputWrap" onSubmit={handleAddFriend}>
            <input
              type="text"
              placeholder="사용자명과 태그로 친구를 추가할 수 있어요"
              onChange={handleInput}
            />
            <button className={canSubmit && "active"} disabled={!canSubmit}>
              친구 요청 보내기
            </button>
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
