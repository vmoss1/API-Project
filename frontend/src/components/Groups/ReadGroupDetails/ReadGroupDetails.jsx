import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupDetails } from "../../../store/groups";
import "./ReadGroupDetails.css";

const ReadGroupDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const groupDetails = useSelector((state) => state.groups.groupDetails);

  useEffect(() => {
    dispatch(fetchGroupDetails(id));
  }, [dispatch, id]);

  let imagePrev = groupDetails.Groupimages?.find(
    (image) => image.preview === true
  );

  return (
    <div>
      <nav id="backToGroupLink">
        <Link to="/groups">Back to Groups Page</Link>
      </nav>
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
          <button id="joinButton" onClick={() => alert("Feature Coming Soon!")}>
            Join this group
          </button>
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
