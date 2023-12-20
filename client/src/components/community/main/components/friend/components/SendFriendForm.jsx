import "./sendFriendForm.scss";
import emptyBanner from "./assets/bca918618b884a382ab5.svg";
import { useEffect, useState } from "react";
import { friendRequestApiSlice, useSendFriendMutation } from "../../../../../../features/friends/slice/friendRequestApiSlice";
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

  const [sendFriend, { data: sendFriendData }] = useSendFriendMutation();

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

    socket?.emit("getFriendRequest", {
      senderId: currentUser._id,
      receiverUserName: userName,
      receiverTag: tag
    });

    sendFriend({
        userName,
        tag
    })
    .unwrap()
    .then((data) => {
        setShowFetchState("친구 요청을 성공적으로 보냈어요!");
        socket?.emit("sendNotification", {
          senderId: currentUser._id,
          receiverId: data.receiverId,
          requestType: "FriendRequest",
        });

        try {
            socket?.on("userNotFound", (res) => {
                if (res.status === 400) {
                    return () => {
                        socket.off("sendNotification");
                        socket.off("getFriendRequest");
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

  useEffect(() => {
    const updateFriendRequest = (newRequest) => {
      friendRequestApiSlice.util.updateQueryData("getAllFriendRequest", undefined, (draftRequestList) => {
        draftRequestList = [newRequest, ...draftRequestList];
      });
    };

    const handleNotificationTexts = (senderId) => {
      socket?.emit("sendNotification", {
        senderId,
        receiverUserName: receiver.userName,
        receiverTag: receiver.tag,
        requestType: "FriendRequest",
        dataType: "text",
      });
    };

    socket.on("sendFriendRequest", ({ change, senderId }) => {
      const { fullDocument: newRequest } = change;

      updateFriendRequest(newRequest);

      handleNotificationTexts(senderId);
    });
  }, [socket, sendFriendData]);

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
