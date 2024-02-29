import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventDetails, deleteEventFunc } from "../../../store/events";
import { fetchGroupDetails } from "../../../store/groups";
import "./ManageEvents.css";
import { CiAlarmOn } from "react-icons/ci";
import { CiDollar } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { FcDownLeft } from "react-icons/fc";
import DeleteModal from "../../DeleteModal/DeleteModal";
import { useModal } from "../../../context/Modal";

const ManageEvents = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();

  const eventDetails = useSelector((state) => state.events.eventDetails);
  const groupDetails = useSelector((state) => state.groups.groupDetails);
  const currentUser = useSelector((state) => state.session.user);
  // console.log(eventDetails.groupId);

  const isOrganizer =
    currentUser && groupDetails.Organizer?.id === currentUser.id;
  // console.log("ORGANIZER", isOrganizer);

  useEffect(() => {
    const fetchDetails = async () => {
      await dispatch(fetchEventDetails(id));
      await dispatch(fetchGroupDetails(eventDetails.groupId));
    };
    fetchDetails();
  }, [dispatch, id, eventDetails.groupId]);

  let imagePrev = eventDetails.Eventimages?.find(
    (image) => image.preview === true
  );

  let groupImagePrev = groupDetails.Groupimages?.find(
    (image) => image.preview === true
  );

  const leaderFirstName = groupDetails.Organizer?.firstName;
  const leaderLastName = groupDetails.Organizer?.lastName;
  const groupType = groupDetails.type;
  const groupName = groupDetails.name;
  const groupPrivacy = groupDetails.private;

  const handleDeleteMessage = async () => {
    const res = await dispatch(deleteEventFunc(eventDetails.id));
    if (res.message === "Successfully deleted") {
      navigate(`/events`);
    }
  };

  const deleteModal = () => {
    setModalContent(<DeleteModal onDelete={handleDeleteMessage} />);
  };
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = date.toLocaleTimeString("en-US", {
      timeStyle: "short",
    });
    return `${formattedDate} · ${formattedTime}`;
  };

  const formattedStartDate = formatEventDate(eventDetails.startDate);
  const formattedEndDate = formatEventDate(eventDetails.endDate);
  // console.log(formattedEndDate, formattedStartDate);

  return (
    <div id="EventPageDetails">
      <div className="topHalfEventContainer">
        <div id="eventHeader">
          <Link to="/events" id="backToLabel">
            <FcDownLeft />
            Back to Events Page
          </Link>
          <h1 id="eventHeaderName">{eventDetails.name}</h1>
          <label id="eventHeaderName">
            Hosted By {leaderFirstName} {leaderLastName}
          </label>
        </div>
        <div>
          <img
            id="imageEventDetails"
            src={
              imagePrev !== undefined
                ? imagePrev.url
                : "https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png"
            }
            alt={eventDetails.name}
          />
        </div>
        <div>
          <div className="upperDetailsOfTop">
            <img
              id="groupImageDetails"
              src={
                groupImagePrev !== undefined
                  ? groupImagePrev.url
                  : "https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png"
              }
              alt={eventDetails.name}
            />
            <div id="groupCardInfo">
              <h2 id="groupNameCard"> {groupName}</h2>
              <p className="paragraphDetails">
                {" "}
                {groupPrivacy ? "Private" : "Public"}
              </p>
            </div>
          </div>

          <div className="lowerDetailsOfTop">
            <div id="lowerDetails">
              <div id="timeContainer">
                <p className="paragraphDetails">
                  {" "}
                  <CiAlarmOn id="icons" />
                  Start {formattedStartDate} End {formattedEndDate}
                </p>
              </div>

              <p className="paragraphDetails">
                <CiDollar id="icons" />
                {eventDetails.price === 0 ? "FREE" : `${eventDetails.price}$`}
              </p>

              <p className="paragraphDetails">
                <CiLocationOn id="icons" /> {groupType}
              </p>
              <div id="organizerButtons">
                {isOrganizer && (
                  <button
                    onClick={() => alert("Feature Coming Soon!")}
                    id="updateEventButton"
                  >
                    Update
                  </button>
                )}
                {isOrganizer && (
                  <button id="deleteEventButton" onClick={deleteModal}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottomEventHalfContainer">
        <h1 id="eventDetailsPara">Details</h1>
        <p className="eventDetailsPara">{eventDetails.description}</p>
      </div>
    </div>
  );
};

export default ManageEvents;
