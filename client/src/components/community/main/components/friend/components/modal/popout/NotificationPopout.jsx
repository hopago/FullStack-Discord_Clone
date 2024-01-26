import { useDeleteNotificationMutation } from "../../../../../../../../features/friends/slice/friendRequestApiSlice";
import "./notificationPopout.scss";

const NotificationPopout = ({ _id, setShowServicesPopout, userName, type }) => {
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleDelete = async () => {
    await deleteNotification({
      userName,
      _id,
      type,
    });

    setShowServicesPopout(false);
  };

  return (
    <div className="servicesPopout">
      <div className="servicesPopout__wrapper" onClick={handleDelete}>
        <span>삭제</span>
        <div className="iconWrap">
          <svg
            class="icon_f09dde"
            aria-hidden="true"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#B5BAC1"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M14.25 1c.41 0 .75.34.75.75V3h5.25c.41 0 .75.34.75.75v.5c0 .41-.34.75-.75.75H3.75A.75.75 0 0 1 3 4.25v-.5c0-.41.34-.75.75-.75H9V1.75c0-.41.34-.75.75-.75h4.5Z"
              class=""
            ></path>
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M5.06 7a1 1 0 0 0-1 1.06l.76 12.13a3 3 0 0 0 3 2.81h8.36a3 3 0 0 0 3-2.81l.75-12.13a1 1 0 0 0-1-1.06H5.07ZM11 12a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0v-6Zm3-1a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z"
              clip-rule="evenodd"
              class=""
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopout;