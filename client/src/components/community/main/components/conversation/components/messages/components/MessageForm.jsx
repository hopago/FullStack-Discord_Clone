import { Redeem, Gif, EmojiEmotions, Add } from "@mui/icons-material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { storage } from "../../../../../../../../lib/firebase/config/firebase";
import { useCreateMessageMutation } from "../../../../../../../../features/messages/messagesApiSlice";
import { socket } from "../../../../../../../..";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../../../../../features/users/slice/userSlice";

const MessageForm = ({ friend, conversationId }) => {
  const currentUser = useSelector(selectCurrentUser);

  const [createMessage] = useCreateMessageMutation();

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const uploadImage = async (imageRef, file) => {
    try {
        const snapshot = await uploadBytes(imageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return url;
      } catch (err) {
        console.error(err);
      }
  };

  const forceMessageToSocket = (message) => {

  }

  const onSubmit = async (e) => {
    e.preventDefault();

    if (file) {
      const imageRef = ref(
        storage,
        `private/messages/images/${
          file.name + new Date().getSeconds() + new Date().getTime()
        }`
      );

      let imgUrl;

      imgUrl = uploadImage(imageRef, file);

      if (imgUrl) {
        try {
          await createMessage({
            conversationId,
            message: { content: { imgUrl } },
          });
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      try {
        const { data: newMessage } = await createMessage({
          conversationId,
          message: { content: { message } },
        });

        if (newMessage) {
          try {
            const res = socket?.emit("sendMessage", {
              message,
              receiverId: friend._id,
              sender: currentUser._id
            });

            if (res.status === 400) {
                return console.log("Receiver not found...");
            }

            if (res.status === 500) {
              return console.log("Something went wrong in socket...");
            }
          } catch (err) {
            console.log(err);
          }
        }

        setMessage("");
      } catch (err) {
        console.log(err)
      }
    }
  };

  return (
    <div className="messagesForm">
      <form onSubmit={onSubmit}>
        <div className="formWrapper">
          <div className="formContentWrapper">
            <div className="addIcons">
              <label htmlFor="private__message__image">
                <Add style={{ fontSize: "19.5px" }} />
              </label>
              <input
                type="file"
                value={file}
                onChange={(e) => setFile(e.target.files[0])}
                id="private__message__image"
              />
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`${friend?.userName}에게 메시지 보내기`}
            />
            <div className="rightIcons">
              <div className="form-icon">
                <Redeem />
              </div>
              <div className="form-icon">
                <Gif />
              </div>
              <div className="form-icon">
                <EmojiEmotions />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;
