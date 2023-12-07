import AuthContext from "context/AuthContext";
import { useContext } from "react";
import { BiUserCircle } from "react-icons/bi";
import { BsHouse } from "react-icons/bs";
import { MdLogin, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function MenuList() {
  const { user } = useContext(AuthContext);

  const navicate = useNavigate();
  return (
    <div className="footer">
      <div className="footer__grid">
        <button type="button" onClick={() => navicate("/")}>
          <BsHouse />
          Home
        </button>
        <button type="button" onClick={() => navicate("/profile")}>
          <BiUserCircle />
          Profile
        </button>
        {user === null ? (
          <button type="button" onClick={() => navicate("/user/login")}>
            <MdLogin />
            Login
          </button>
        ) : (
          <button type="button" onClick={() => navicate("/")}>
            <MdLogout />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
