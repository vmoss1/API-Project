import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { fetchAllGroups } from "../../../store/groups";
import "./ReadGroups.css";

const AllGroupList = () => {
  const dispatch = useDispatch();

  const groups = useSelector((state) => state.groups.list);

  useEffect(() => {
    dispatch(fetchAllGroups());
  }, [dispatch]);

  return (
    <div className="groups-page">
      <img id="logo" src="hogwarts-logo.png" alt="Hogwarts-logo" />
      <div className="pageLinks">
        <NavLink id="event" to="/events">
          Events
        </NavLink>
        <NavLink id="group" to="/groups">
          Groups
        </NavLink>
      </div>
      <div>
        <h2 id="wizardGroup">Wizard Groups Available</h2>
      </div>
      <div className="groups-list">
        {groups.map((group) => (
          <a
            href={`/groups/${group.id}`}
            key={group.id}
            className="wizard-group"
          >
            <div>
              <img
                src={
                  group.previewImage !== "No preview image found."
                    ? group.previewImage
                    : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
                }
                alt={group.name}
              />
              <div>
                <h2 className="groupName">{group.name}</h2>
                <p className="groupLocation">
                  {group.city}, {group.state}
                </p>
                <p className="groupInfo">{group.about}</p>
                <p className="groupType">
                  {group.numEvents} Events ·{" "}
                  {group.private ? "Private" : "Public"}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
export default AllGroupList;
