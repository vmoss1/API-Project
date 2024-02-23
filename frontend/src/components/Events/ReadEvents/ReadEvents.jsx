import { fetchAllEvents } from "../../../store/events";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./ReadEvents.css";
import { useMemo } from "react";

const AllEventList = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.list);
  // console.log("EVENTS", events);

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  const sortedByDateEvents = useMemo(() => {
    return [...events].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
  }, [events]);

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

  const upcomingEvents = sortedByDateEvents.map((event) => ({
    ...event,
    formattedDate: formatEventDate(event.startDate),
  }));

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
        {upcomingEvents.map((event) => (
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
                <p id="startDate">Start Date: {event.formattedDate}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AllEventList;
