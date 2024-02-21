import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { Link } from "react-router-dom";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const isLoggedIn = useSelector((state) => state.session.user !== null);

  return (
    <nav>
      <div>
        <NavLink id="linkWand" to="/">
          TheWand
        </NavLink>
      </div>
      {isLoaded && (
        <div id="topButton">
          <ProfileButton user={sessionUser} />
          {isLoggedIn && (
            <Link to={"/groups/new"} id="newGroupButton">
              Create a new group
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navigation;
