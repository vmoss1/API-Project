import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { fetchAllGroups } from "../../../store/groups";
import { fetchAllEvents } from "../../../store/events";

import "./ReadGroups.css";

const AllGroupList = () => {
  const dispatch = useDispatch();

  const groups = useSelector((state) => state.groups.list);
  const events = useSelector((state) => state.events.list);

  useEffect(() => {
    const allFuncs = async () => {
      dispatch(fetchAllGroups());
      dispatch(fetchAllEvents());
    };
    allFuncs();
  }, [dispatch]);

  const countGroupEvents = (groupId) => {
    return events.filter((event) => event.groupId === groupId).length;
  };

  // console.log(countGroupEvents(2));

  return (
    <div className="groups-page">
      <img id="logo" src="hogwarts-logo.png" alt="Hogwarts-logo" />
      <div className="pageLinks">
        <NavLink id="eventLink" to="/events">
          Events
        </NavLink>
        <NavLink id="groupLink" to="/groups">
          Groups
        </NavLink>
      </div>
      <div>
        <h2 id="wizardGroup">Wizard Groups Available</h2>
      </div>
      <div className="groups-list">
        {groups.map((group) => (
          <Link
            to={`/groups/${group.id}`}
            key={group.id}
            className="wizard-group"
          >
            <div>
              <img
                className="Images"
                src={
                  group.previewImage !== "No preview image found."
                    ? group.previewImage
                    : "https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png"
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
                  {countGroupEvents(group.id)} Events ·{" "}
                  {group.private ? "Private" : "Public"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default AllGroupList;
