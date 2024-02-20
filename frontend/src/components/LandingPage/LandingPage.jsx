import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import { LandingPageCard } from "./LandingPageCards";
import wizardGroup from "/wizard-groups.png";
import quidditchImg from "/quidditch-event.png";
import newGroup from "/new-group.png";
import "./LandingPage.css";

export function LandingPage() {
  const isLoggedIn = useSelector((state) => state.session.user !== null);

  return (
    <div id="introForm">
      <h1 id="welcomeH1">TheWand</h1>
      <img id="logo" src="hogwarts-logo.png" alt="Hogwarts-logo" />
      <p id="landingParagraph">
        Who knows what magical adventure awaits for you
      </p>
      <h3 id="whatAbout">What we are about: </h3>
      <p id="paragraphAbout">
        Delve into the depths of enchantment and sorcery as we bring together
        enthusiasts of all levels, for events of magical exploration and
        camaraderie.
      </p>
      <div className="landingCards">
        <LandingPageCard
          image={wizardGroup}
          alt={"Wizards huddled"}
          path={`groups`}
          linkText={`See all Groups`}
        />
        <LandingPageCard
          image={quidditchImg}
          alt={"Quidditch game"}
          path={`events`}
          linkText={`Find an Event`}
        />

        {isLoggedIn ? (
          <LandingPageCard
            image={newGroup}
            alt={"New Group Photo"}
            path={`groups/new`}
            linkText={`Create a new group`}
          />
        ) : (
          <LandingPageCard
            image={newGroup}
            alt={"New Group Photo"}
            path={""}
            linkText={`*Log in to create a new group*`}
          />
        )}
      </div>
      {!isLoggedIn && (
        <div className="JoinButton">
          <OpenModalButton
            buttonText="Join Today"
            modalComponent={<SignupFormModal />}
          />
        </div>
      )}
    </div>
  );
}
