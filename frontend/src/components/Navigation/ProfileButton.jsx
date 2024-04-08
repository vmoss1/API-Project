import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { GiHarryPotterSkull } from "react-icons/gi";
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;
    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="profile-dropdown-container">
      {user && (
        <div className="profile-button-container">
          <div
            style={{ fontSize: "30px" }}
            onClick={toggleMenu}
            className="profile-button"
          >
            <GiHarryPotterSkull />
          </div>
        </div>
      )}
      <div id="profile-dropdown">
        {user && showMenu && (
          <ul className={ulClassName} ref={ulRef}>
            <li>Hello! {user.firstName}</li>
            <li>{user.email}</li>
            <li>
              <button id="logout-button" onClick={logout}>
                Log Out
              </button>
            </li>
          </ul>
        )}
      </div>
      {!user && (
        <div className="login-signup-buttons">
          <OpenModalButton
            buttonText="Log In"
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />
          <OpenModalButton
            buttonText="Sign Up"
            onItemClick={closeMenu}
            modalComponent={<SignupFormModal />}
          />
        </div>
      )}
    </div>
  );
}

export default ProfileButton;
