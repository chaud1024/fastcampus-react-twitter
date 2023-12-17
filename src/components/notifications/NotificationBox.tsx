import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { NotificationProps } from "pages/notification";
import { useNavigate } from "react-router-dom";

export default function NotificationBox({
  notification,
}: {
  notification: NotificationProps;
}) {
  const navigate = useNavigate();

  const handleNotification = async (url: string) => {
    // isRead 업데이트: 기본 읽지 않음 -> 읽으면 true 로 업데이트
    const ref = doc(db, "notifications", notification?.id);
    await updateDoc(ref, {
      isRead: true,
    });
    // url로 이동
    navigate(url);
  };

  return (
    <div className="notification" key={notification.id}>
      <div className="" onClick={() => handleNotification(notification?.url)}>
        <div className="notification__flex">
          <div className="notification__createdAt">
            {notification?.createdAt}
          </div>
          {notification?.isRead === false && (
            <div className="notification__unread" />
          )}
        </div>
        <div className="notification__content">{notification?.content}</div>
      </div>
    </div>
  );
}
