import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventDetails, deleteEventFunc } from "../../../store/events";
import { fetchGroupDetails } from "../../../store/groups";
import "./ManageEvents.css";
import { CiAlarmOn } from "react-icons/ci";
import { CiDollar } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { BsChevronDoubleLeft } from "react-icons/bs";

const ManageEvents = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleted, setDeleted] = useState(false);

  const eventDetails = useSelector((state) => state.events.eventDetails);
  const groupDetails = useSelector((state) => state.groups.groupDetails);

  // console.log(groupDetails.Organizer);

  let imagePrev = eventDetails.Eventimages?.find(
    (image) => image.preview === true
  );

  let groupImagePrev = groupDetails.Groupimages?.find(
    (image) => image.preview === true
  );

  useEffect(() => {
    const fetchDetails = async () => {
      await dispatch(fetchEventDetails(id));
      await dispatch(fetchGroupDetails(id));
    };
    fetchDetails();
  }, [dispatch, id]);

  const leaderFirstName = groupDetails.Organizer?.firstName;
  const leaderLastName = groupDetails.Organizer?.lastName;
  const groupType = groupDetails.type;
  const groupName = groupDetails.name;
  const groupPrivacy = groupDetails.private;

  const handleDeleteMessage = async () => {
    const res = await dispatch(deleteEventFunc(eventDetails.id));
    if (res.message === "Successfully deleted") navigate(`/events`);
  };
  const handleDeleteEvent = () => {
    setDeleted(true);
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
    <div>
      <div id="backToEventLink"></div>

      <div id="eventHeader">
        <Link to="/events" id="backToLabel">
          <BsChevronDoubleLeft />
          Back to Events Page
        </Link>
        <h1>{eventDetails.name}</h1>
        <h2>
          Hosted By {leaderFirstName} {leaderLastName}
        </h2>
      </div>
      <div className="topHalfContainer">
        <div>
          <img
            id="imageDetails"
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
              <h2> {groupName}</h2>
              <p> {groupPrivacy ? "Private" : "Public"}</p>
            </div>
          </div>

          <div className="lowerDetailsOfTop">
            <div id="lowerDetails">
              <div id="timeContainer">
                <p>
                  {" "}
                  <CiAlarmOn id="icons" />
                  Start {formattedStartDate} End {formattedEndDate}
                </p>
              </div>

              <p className="para">
                <CiDollar id="icons" />
                {eventDetails.price}$
              </p>

              <p className="para">
                <CiLocationOn id="icons" /> {groupType}
              </p>

              <button onClick={""} id="deleteButton">
                Update
              </button>
              <button onClick={handleDeleteEvent} id="deleteButton">
                Delete
              </button>
              {deleted && (
                <div>
                  <p>Are you sure?</p>
                  <button onClick={handleDeleteMessage}>Yes!</button>
                  <button onClick={() => setDeleted(false)}>No!</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bottomHalfContainer">
        <h1>Details</h1>
        <p>{eventDetails.description}</p>
      </div>
    </div>
  );
};

export default ManageEvents;
