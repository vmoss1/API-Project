import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { Link } from "react-router-dom";
import { FaWandSparkles } from "react-icons/fa6";

import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const isLoggedIn = useSelector((state) => state.session.user !== null);

  return (
    <nav>
      <div id="homeButtonWand">
        <div style={{ fontSize: "30px" }}>
          <FaWandSparkles />
        </div>
        <NavLink id="linkWand" to="/">
          TheWand
        </NavLink>
      </div>
      {isLoaded && (
        <div id="topButton">
          <ProfileButton user={sessionUser} />
          {isLoggedIn && (
            <Link to={"/groups/new"} className="newGroupButton">
              Create a new group
            </Link>
          )}
          <Link to={"/groups"} className="newGroupButton">
            View Groups
          </Link>
          <Link to={"/events"} className="newGroupButton">
            View Events
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
