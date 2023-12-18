import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { BsHouse } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdLogin, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useTranslation from "hooks/useTranslation";

export default function MenuList() {
  const { user } = useContext(AuthContext);

  const navicate = useNavigate();
  const t = useTranslation();

  return (
    <div className="footer">
      <div className="footer__grid">
        <button type="button" onClick={() => navicate("/")}>
          <BsHouse />
          {t("MENU_HOME")}
        </button>
        <button type="button" onClick={() => navicate("/profile")}>
          <BiUserCircle />
          {t("MENU_PROFILE")}
        </button>
        <button type="button" onClick={() => navicate("/search")}>
          <AiOutlineSearch />
          {t("MENU_SEARCH")}
        </button>
        <button type="button" onClick={() => navicate("/notification")}>
          <IoMdNotificationsOutline />
          {t("MENU_NOTI")}
        </button>
        {user === null ? (
          <button type="button" onClick={() => navicate("/user/login")}>
            <MdLogin />
            {t("MENU_LOGIN")}
          </button>
        ) : (
          <button
            type="button"
            onClick={async () => {
              const auth = getAuth(app);
              await signOut(auth);
              toast.success("로그아웃 되었습니다.");
            }}>
            <MdLogout />
            {t("MENU_LOGOUT")}
          </button>
        )}
      </div>
    </div>
  );
}
