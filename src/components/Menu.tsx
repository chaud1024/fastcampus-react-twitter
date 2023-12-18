import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { BsHouse } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdLogin, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function MenuList() {
  const { user } = useContext(AuthContext);

  const navicate = useNavigate();
  const t = useTranslation();

  return (
    <div className="footer">
      <div className="footer__grid">
        <button type="button" onClick={() => navicate("/")}>
          <BsHouse />
          <span className="footer__grid--text">{t("MENU_HOME")}</span>
        </button>
        <button type="button" onClick={() => navicate("/profile")}>
          <BiUserCircle />
          <span className="footer__grid--text">{t("MENU_PROFILE")}</span>
        </button>
        <button type="button" onClick={() => navicate("/search")}>
          <AiOutlineSearch />
          <span className="footer__grid--text">{t("MENU_SEARCH")}</span>
        </button>
        <button type="button" onClick={() => navicate("/notification")}>
          <IoMdNotificationsOutline />
          <span className="footer__grid--text">{t("MENU_NOTI")}</span>
        </button>
        {user === null ? (
          <button type="button" onClick={() => navicate("/user/login")}>
            <MdLogin />
            <span className="footer__grid--text">{t("MENU_LOGIN")}</span>
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
            <span className="footer__grid--text">{t("MENU_LOGOUT")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
