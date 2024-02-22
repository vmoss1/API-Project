import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupEvents } from "../../../store/groups";
import { useMemo } from "react";
import "./ReadGroupEvents.css";

const ReadGroupEvents = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const groupEvents = useSelector((state) => state.groups.groupEvents);
  // console.log("GROUPS", groupEvents);

  useEffect(() => {
    dispatch(fetchGroupEvents(id));
  }, [dispatch, id]);

  //cache a calculation between re-renders
  const sortedByDate = useMemo(() => {
    return [...groupEvents].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
  }, [groupEvents]);

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

  const upcomingEvents = sortedByDate
    .filter((event) => new Date(event.startDate) > new Date())
    .map((event) => ({
      ...event,
      formattedDate: formatEventDate(event.startDate),
    }));

  const pastEvents = sortedByDate
    .filter((event) => new Date(event.startDate) <= new Date())
    .map((event) => ({
      ...event,
      formattedDate: formatEventDate(event.startDate),
    }));

  return (
    <div className="eventCard">
      <div id="upcomingEventsCard">
        <h2>Upcoming Events</h2>
        {upcomingEvents.map((event) => (
          <a href={`/events/${event.id}`} key={event.id}>
            <div id="eachCard">
              {" "}
              <img
                id="eventImage"
                src={
                  event.previewImage !== undefined
                    ? event.previewImage
                    : "https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png"
                }
                alt={event.name}
              />
              <div id="eventItems">
                <p>{event.formattedDate}</p>
                <h2>{event.name}</h2>
                {event.Venue ? (
                  <p>
                    {event.Venue.city}, {event.Venue.state}
                  </p>
                ) : (
                  <p>Venue pending...</p>
                )}
                <p>{event.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div id="pastEventsCard">
        <h2>Past Events</h2>
        {pastEvents.map((event) => (
          <a href={`/events/${event.id}`} key={event.id}>
            <div>
              {" "}
              <img id="eventImage" src={event.previewImage} alt={event.name} />
              <div id="eventItems">
                <p>{event.formattedDate}</p>
                <h2>{event.name}</h2>
                {event.Venue ? (
                  <p>
                    {event.Venue.city}, {event.Venue.state}
                  </p>
                ) : (
                  <p>Venue pending...</p>
                )}
                <p>{event.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ReadGroupEvents;
