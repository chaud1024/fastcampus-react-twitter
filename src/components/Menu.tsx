import { BiUserCircle } from "react-icons/bi";
import { BsHouse } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function MenuList() {
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
        <button type="button" onClick={() => navicate("/login")}>
          <MdLogout />
          Logout
        </button>
      </div>
    </div>
  );
}
