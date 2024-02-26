import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroupDetails,
  deleteGroupFunc,
  fetchGroupEvents,
} from "../../../store/groups";
import ReadGroupEvents from "../ReadGroupEvents/ReadGroupEvents";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import { BsChevronDoubleLeft } from "react-icons/bs";
import "./ReadGroupDetails.css";

const ReadGroupDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const closeDeleteMenu = () => setShowMenu(false);

  const groupDetails = useSelector((state) => state.groups.groupDetails);
  const groupEvents = useSelector((state) => state.groups.groupEvents);
  const currentUser = useSelector((state) => state.session?.user);

  const isGroupOrganizer =
    currentUser && groupDetails?.Organizer?.id === currentUser.id;
  const isNotGroupOrganizer =
    currentUser && groupDetails?.Organizer?.id !== currentUser.id;

  let imagePrev = groupDetails.Groupimages?.find(
    (image) => image.preview === true
  );

  useEffect(() => {
    const fetchDetails = async () => {
      await dispatch(fetchGroupEvents(id));
      await dispatch(fetchGroupDetails(id));
    };
    fetchDetails();
  }, [dispatch, id]);

  const countGroupEvents = () => {
    return groupEvents.length;
  };

  if (!groupEvents) {
    return null;
  }

  // const eventName = eventDetails.name;
  // const eventTime = eventDetails.startDate;
  // const eventDescription = eventDetails.description;
  // const eventCity = eventDetails.Venue.city;
  // const eventState = eventDetails.Venue.state;

  const handleUpdate = () => {
    // passing current state object to the new page
    navigate("/groups/update", {
      state: {
        groupId: id,
        userId: groupDetails.organizerId,
        groupName: groupDetails.name,
        groupCity: groupDetails.city,
        groupState: groupDetails.state,
        groupAbout: groupDetails.about,
        groupType: groupDetails.type,
        groupPrivate: groupDetails.private,
      },
    });
  };

  const handleCreateEvent = () => {
    navigate("/events/new", {
      state: { groupId: id, groupName: groupDetails.name },
    });
  };

  const handleDeleteMessage = async (e) => {
    e.preventDefault();
    const res = await dispatch(deleteGroupFunc(groupDetails.id));
    if (res.message === "Successfully deleted") {
      closeDeleteMenu(); // Close the menu when the delete action is confirmed
      navigate(`/groups`);
    }
  };

  if (!groupEvents) return null;

  return (
    <div>
      <div className="topHalfContainer">
        <div id="PhotoAndBreadCrumbLink">
          {" "}
          <div id="backToGroupLink">
            <Link to="/groups" id="backToLabel">
              <BsChevronDoubleLeft />
              Back to Groups Page
            </Link>
          </div>
          <div>
            <img
              id="imageDetails"
              src={
                imagePrev !== undefined
                  ? imagePrev.url
                  : "https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png"
              }
              alt={groupDetails.name}
            />
          </div>{" "}
        </div>

        <div className="topDetails">
          <div id="detailsTop">
            <h1>{groupDetails.name}</h1>
            <p className="para">
              {groupDetails.city} , {groupDetails.state}
            </p>
            <p className="para">
              {countGroupEvents(groupEvents.groupId)} Events ·
              {groupDetails.private ? "Private" : "Public"}
            </p>
            <p className="para">
              Group Leader: {groupDetails?.Organizer?.firstName}{" "}
              {groupDetails?.Organizer?.lastName}
            </p>
          </div>
          <div className="buttonContainer">
            {isGroupOrganizer && (
              <button id="createButton" onClick={handleCreateEvent}>
                Create Event
              </button>
            )}
            {isGroupOrganizer && (
              <button id="Update" onClick={handleUpdate}>
                Update
              </button>
            )}
            {isGroupOrganizer && (
              <OpenModalButton
                value={showMenu}
                buttonText="Delete"
                onButtonClick={() => setShowMenu(true)}
                onModalClose={closeDeleteMenu} // Pass closeDeleteMenu function
                modalComponent={
                  <div>
                    <p>Are you sure?</p>
                    <button onClick={handleDeleteMessage}>Yes!</button>
                    <button onClick={closeDeleteMenu}>No!</button>
                  </div>
                }
              />
            )}
            {isNotGroupOrganizer && (
              <button
                id="joinButton"
                onClick={() => alert("Feature Coming Soon!")}
              >
                Join this group
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="bottomHalfContainer">
        <h1>Organizer</h1>
        <p className="para">
          {groupDetails?.Organizer?.firstName}{" "}
          {groupDetails?.Organizer?.lastName}{" "}
        </p>
        <h1>What we are about</h1>
        <p className="para">{groupDetails.about}</p>
        <h1>Events {countGroupEvents(groupEvents.id)}</h1>
      </div>

      {/* <div id="eventsDiv">
        <div id="eventCard">
          <img
            id="eventImageDetails"
            src={
              eventImagePrev !== undefined
                ? eventImagePrev.url
                : "https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png"
            }
            alt={eventDetails.name}
          />
          <div id="eventItems">
            <p>{eventTime}</p>
            <h2>{eventName}</h2>
            <p>
              {eventCity} , {eventState}
            </p>
          </div>
        </div>
        <div id="descripEvent">
          <p>{eventDescription}</p>
        </div>
      </div> */}
      <div>{groupEvents && <ReadGroupEvents />}</div>
    </div>
  );
};

export default ReadGroupDetails;
