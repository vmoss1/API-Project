import { fetchAllEvents } from "../../../store/events";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./ReadEvents.css";

const AllEventList = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.list);
  // console.log("EVENTS", events);

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  return (
    <div className="events-page">
      <img id="logo" src="hogwarts-logo.png" alt="Hogwarts-logo" />
      <div className="eventPageLinks">
        <NavLink id="event" to="/events">
          Events
        </NavLink>
        <NavLink id="group" to="/groups">
          Groups
        </NavLink>
      </div>
      <div>
        <h2 id="wizardGroup">Wizard Events Available</h2>
      </div>
      <div className="events-list">
        {events.map((event) => (
          <a
            href={`/events/${event.id}`}
            key={event.id}
            className="wizard-event"
          >
            <div id="photoBox">
              <img
                className="eventImages"
                src={
                  event.previewImage !== "No preview image found."
                    ? event.previewImage
                    : "https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png"
                }
                alt={event.name}
              />
              <div>
                <h2 className="eventName">{event.name}</h2>
                {event.Venue ? (
                  <p id="locationP">
                    {event.Venue.city}, {event.Venue.state}
                  </p>
                ) : (
                  <p>Venue pending...</p>
                )}
                <p id="locationP">{event.type}</p>
                <p className="eventType">{event.numAttending} attending</p>
                {/* <p>{event.description}</p> */}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AllEventList;
