import { useNavigate } from "react-router-dom";
import { useLazyGetConversationByMemberIdQuery } from "../../../../../../../../features/conversation/slice/conversationsApiSlice";
import {
  useCreateNotificationMutation,
  useSendFriendMutation,
} from "../../../../../../../../features/friends/slice/friendRequestApiSlice";
import { socket } from "../../../../../../../..";

const ActionButton = ({ isFriend, friend, currentUser }) => {
  const navigate = useNavigate();

  const [getConversationByMemberId] = useLazyGetConversationByMemberIdQuery();
  const [sendFriendRequest] = useSendFriendMutation();
  const [sendNotification] = useCreateNotificationMutation();

  const moveToMessagePage = async () => {
    const { data: conversation } = await getConversationByMemberId(friend._id);

    if (conversation) {
      navigate(`/community/conversation/${conversation._id}`);
    }
  };

  const sendFriend = () => {
    const { userName, tag, _id: friendId } = friend;

    sendFriendRequest({
      userName,
      tag,
    })
      .unwrap()
      .then(async (_) => {
        await sendNotification({
          senderId: currentUser._id,
          type: "friendRequest_send",
          userName: currentUser.userName,
          tag: currentUser.tag,
        });

        socket?.emit("sendNotification", {
          senderId: currentUser._id,
          receiverId: friendId,
          requestType: "friendRequest_send",
          tag,
          userName,
        });

        try {
          socket?.on("userNotFound", (res) => {
            if (res.status === 400) {
              return () => {
                socket.off("sendNotification");
                socket.off("userNotFound");
              };
            }
          });
        } catch (err) {
          console.error(`socket, userNotFound: ${err}`);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSubmit = () => {
    isFriend ? sendFriend() : moveToMessagePage();
  };

  return (
    <button onClick={handleSubmit}>
      {isFriend ? "메시지 보내기" : "친구 요청 보내기"}
    </button>
  );
};

export default ActionButton;
