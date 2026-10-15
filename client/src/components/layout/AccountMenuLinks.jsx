import { CircleUser, LogOut, PlusSquare, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const AccountMenuLinks = ({ user, isAdmin, onLogout, itemClass, dangerClass, dividerClass }) => (
  <>
    <Link className={itemClass} to="/CreateOffer">
      <PlusSquare className="h-4 w-4" /> Stwórz post
    </Link>
    <div className={dividerClass}></div>
    <Link className={itemClass} to={`/profile/${user.id || user._id}`}>
      <CircleUser className="h-4 w-4" /> Mój profil
    </Link>
    <div className={dividerClass}></div>
    {isAdmin && (
      <>
        <Link className={dangerClass} to="/admin">
          <ShieldAlert className="h-4 w-4" /> Panel Admina
        </Link>
        <div className={dividerClass}></div>
      </>
    )}
    <button onClick={onLogout} className={dangerClass}>
      <LogOut className="h-4 w-4" /> Wyloguj
    </button>
  </>
);

export default AccountMenuLinks;
