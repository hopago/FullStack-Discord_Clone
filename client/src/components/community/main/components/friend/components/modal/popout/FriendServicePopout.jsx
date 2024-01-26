import { useEffect } from "react";
import "./friendServicePopout.scss";
import { useAddBlackListMutation } from "../../../../../../../../features/blackList/slice/blackListApiSlice";
import { usersApiSlice } from "../../../../../../../../features/users/slice/usersApiSlice";
import {
  conversationsApiSlice,
  useLazyGetConversationByMemberIdQuery,
} from "../../../../../../../../features/conversation/slice/conversationsApiSlice";
import { useNavigate } from "react-router-dom";

const FriendServicePopout = ({ showPopout, setShowPopout, xy, friend }) => {
  const [addBlackList] = useAddBlackListMutation();
  const [getConversationByMemberId] = useLazyGetConversationByMemberIdQuery();

  const navigate = useNavigate();

  const addBlockUser = () => {
    addBlackList(friend._id)
      .unwrap()
      .then((res) => {
        if (res.data) {
          try {
            usersApiSlice.util.updateQueryData(
              "getCurrentUser",
              undefined,
              (draftCurrUser) => {
                const { _id, avatar, userName } = friend;
                const blockUserInfo = {
                  _id,
                  avatar,
                  userName,
                };

                draftCurrUser.blackList.push(blockUserInfo);

                const findIndex = draftCurrUser.friends.findIndex(
                  (friend) => friend._id === blockUserInfo._id
                );

                if (findIndex !== -1) {
                  draftCurrUser.friends.splice(findIndex, 1);
                }
              }
            );
          } catch (err) {
            console.error(err);
          }
        }
      })
      .then((res) => {
        let deletedConversation;

        if (res) {
          try {
            conversationsApiSlice.util.updateQueryData(
              "getConversations",
              undefined,
              (draftConversations) => {
                deletedConversation = draftConversations.filter(
                  (conversation) => {
                    return conversation.members.some(
                      (member) => member._id === friend._id
                    );
                  }
                );

                draftConversations.filter(
                  (conversation) => conversation._id !== deletedConversation._id
                );
              }
            );
          } catch (err) {
            console.error(err);
          }

          if (typeof deletedConversation?._id === "string") {
            const deleteConversation = async () => {
              await conversationsApiSlice.endpoints.deleteConversation(
                deletedConversation._id
              );
            };

            try {
              deleteConversation();
            } catch (err) {
              console.error(err);
            }
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const pushToPrivateMessageRoom = async () => {
    const conversation = await getConversationByMemberId(friend._id)
      .unwrap()
      .catch((err) => console.error(err));

    if (conversation) {
      navigate(`/community/conversation/${conversation._id}`);
    }
  };

  const handleServicePopoutOutsideClick = (e) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    if (
      clientX < xy.x ||
      clientX > xy.x + 165 ||
      clientY < xy.y ||
      clientY > xy.y + 120
    ) {
      setShowPopout(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleServicePopoutOutsideClick);

    return () => {
      window.removeEventListener("click", handleServicePopoutOutsideClick);
    };
  }, [showPopout]);

  return (
    <div
      className="friendServicePopout"
      style={{
        top: `26px`,
        right: `-153px`,
      }}
    >
      <div className="wrapper">
        <div className="flexCol" onClick={addBlockUser}>
          <span>차단하기</span>
        </div>
        <div className="flexCol">
          <span>사용자 프로필 신고하기</span>
        </div>
        <div className="flexCol" onClick={pushToPrivateMessageRoom}>
          <span className="lastChild">메세지 보내기</span>
        </div>
      </div>
    </div>
  );
};

export default FriendServicePopout;
