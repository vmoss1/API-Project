import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import { LandingPageCard } from "./LandingPageCards";
import wizardGroup from "/wizard-groups.png";
import quidditchImg from "/quidditch-event.png";
import newGroup from "/new-group.png";
import "./LandingPage.css";
import { Link } from "react-router-dom";

export function LandingPage() {
  const isLoggedIn = useSelector((state) => state.session.user !== null);

  return (
    <div id="introForm">
      <div id="section1">
        <div>
          <h1 id="welcomeH1">TheWand</h1>

          <p id="landingParagraph">
            Who knows what magical adventure awaits for you
          </p>
        </div>
        <img id="infoGraphic" src="info.png" alt="Hogwarts-logo" />
      </div>
      <div id="section2">
        <h3 id="whatAbout">What we are about: </h3>
        <p id="paragraphAbout">
          Delve into the depths of enchantment and sorcery as we bring together
          enthusiasts of all levels, for events of magical exploration and
          camaraderie.
        </p>
      </div>
      <div className="landingCards">
        <div id="landingGroupCard">
          <LandingPageCard
            image={wizardGroup}
            alt={"Wizards huddled"}
            path={`groups`}
            linkText={`See all Groups`}
          />
        </div>
        <div id="landingEventCard">
          <LandingPageCard
            image={quidditchImg}
            alt={"Quidditch game"}
            path={`events`}
            linkText={`Find an Event`}
          />
        </div>
        <div id="landingCreateCard">
          {isLoggedIn ? (
            <LandingPageCard
              image={newGroup}
              alt={"New Group Photo"}
              path={`groups/new`}
              linkText={`Create a new group`}
            />
          ) : (
            <Link to={""}>
              <div className="landing-card">
                <img
                  className="landing-img"
                  src={newGroup}
                  alt={"New Group Photo"}
                ></img>
                <h4 className={`landing-link-disabled ${""}`}>
                  {"Please Login to create a Group"}
                </h4>
              </div>
            </Link>
          )}
        </div>
      </div>
      <div>
        {!isLoggedIn && (
          <div className="JoinButton">
            <OpenModalButton
              buttonText="Join Today"
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </div>
    </div>
  );
}
