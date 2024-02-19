import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupDetails } from "../../../store/groups";

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
      <div className="topHalf">
        <nav>
          <Link to="/groups">Back to Groups</Link>
        </nav>
        <img
          src={
            imagePrev !== undefined
              ? imagePrev.url
              : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
          }
          alt={groupDetails.name}
        />
        <h1>{groupDetails.name}</h1>
        <p>
          {groupDetails.city} , {groupDetails.state}
        </p>
        <p>
          {groupDetails.numEvents} Events ·
          {groupDetails.private ? "Private" : "Public"}
        </p>
        <p>
          Group Leader {groupDetails.Organizer?.firstName},{" "}
          {groupDetails.Organizer?.lastName}
        </p>
        <button onClick={() => alert("Feature Coming Soon!")}>
          Join this group
        </button>
      </div>
      <div className="bottomHalf">
        <h3>Organizer</h3>
        <p>
          {groupDetails.Organizer?.firstName} {groupDetails.Organizer?.lastName}{" "}
        </p>
        <h3>What we are about</h3>
        <p>{groupDetails.about}</p>
        <h1>Events {groupDetails.numEvents}</h1>
      </div>
    </div>
  );
};

export default ReadGroupDetails;
