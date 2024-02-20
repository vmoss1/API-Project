import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupDetails, deleteGroupFunc } from "../../../store/groups";
import "./ReadGroupDetails.css";

const ReadGroupDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleted, setDeleted] = useState(false);

  const groupDetails = useSelector((state) => state.groups.groupDetails);
  const currentUser = useSelector((state) => state.session?.user);

  const isGroupOrganizer =
    currentUser && groupDetails.Organizer?.id === currentUser.id;
  const isNotGroupOrganizer =
    currentUser && groupDetails.Organizer?.id !== currentUser.id;

  let imagePrev = groupDetails.Groupimages?.find(
    (image) => image.preview === true
  );

  useEffect(() => {
    dispatch(fetchGroupDetails(id));
  }, [dispatch, id]);

  const handleUpdate = () => {
    // passing current state object to the new page
    navigate("/edit-group", {
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

  const handleDeleteMessage = async () => {
    const res = await dispatch(deleteGroupFunc(groupDetails.id));
    if (res.message === "Successfully deleted") navigate(`/groups`);
  };
  const handleDeleteGroup = () => {
    setDeleted(true);
  };

  return (
    <div>
      <div id="backToGroupLink">
        <Link to="/groups" id="backToLabel">
          Back to Groups Page
        </Link>
      </div>

      <div className="topHalfContainer">
        <div>
          <img
            id="imageDetails"
            src={
              imagePrev !== undefined
                ? imagePrev.url
                : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
            }
            alt={groupDetails.name}
          />
        </div>
        <div className="topDetails">
          <h1>{groupDetails.name}</h1>
          <p className="para">
            {groupDetails.city} , {groupDetails.state}
          </p>
          <p className="para">
            {groupDetails.numEvents} Events ·
            {groupDetails.private ? "Private" : "Public"}
          </p>
          <p className="para">
            Group Leader {groupDetails.Organizer?.firstName},{" "}
            {groupDetails.Organizer?.lastName}
          </p>
          <div className="buttonContainer">
            {isGroupOrganizer && (
              <button id="createButton">Create Event</button>
            )}
            {isGroupOrganizer && (
              <button id="Update" onClick={handleUpdate}>
                Update
              </button>
            )}
            {isGroupOrganizer && (
              <button onClick={handleDeleteGroup} id="deleteButton">
                Delete
              </button>
            )}
            {deleted && (
              <div>
                <p>Are you sure?</p>
                <button onClick={handleDeleteMessage}>Yes!</button>
                <button onClick={() => setDeleted(false)}>No!</button>
              </div>
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
        <p>
          {groupDetails.Organizer?.firstName} {groupDetails.Organizer?.lastName}{" "}
        </p>
        <h1>What we are about</h1>
        <p>{groupDetails.about}</p>
        <h1>Events {groupDetails.numEvents}</h1>
      </div>
    </div>
  );
};

export default ReadGroupDetails;
