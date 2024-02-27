import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroupDetails,
  deleteGroupFunc,
  fetchGroupEvents,
} from "../../../store/groups";
import ReadGroupEvents from "../ReadGroupEvents/ReadGroupEvents";
// import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import { BsChevronDoubleLeft } from "react-icons/bs";
import DeleteModal from "../../DeleteModal/DeleteModal";
import "./ReadGroupDetails.css";
import { useModal } from "../../../context/Modal";

const ReadGroupDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();

  const groupDetails = useSelector((state) => state.groups.groupDetails);
  const groupEvents = useSelector((state) => state.groups.groupEvents);
  const currentUser = useSelector((state) => state.session?.user);
  // console.log(groupDetails);

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
      state: {
        groupId: id,
        groupName: groupDetails.name,
        venueId: groupDetails.Venues[0].id,
      },
    });
  };

  const handleDeleteMessage = async () => {
    const res = await dispatch(deleteGroupFunc(groupDetails.id));
    if (res.message === "Successfully deleted") {
      navigate(`/groups`);
    }
  };

  const deleteModal = () => {
    setModalContent(<DeleteModal onDelete={handleDeleteMessage} />);
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
            {isGroupOrganizer && <button onClick={deleteModal}>Delete</button>}
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
        <h1>Organized By</h1>
        <p className="para">
          {groupDetails?.Organizer?.firstName}{" "}
          {groupDetails?.Organizer?.lastName}{" "}
        </p>
        <h1>What we are about</h1>
        <p className="para">{groupDetails.about}</p>
        <h1>Events ({countGroupEvents(groupEvents.id)})</h1>
      </div>
      <div>{groupEvents && <ReadGroupEvents />}</div>
    </div>
  );
};

export default ReadGroupDetails;
