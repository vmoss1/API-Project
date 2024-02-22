import { csrfFetch } from "./csrf";

// actions
const READ_EVENTS = "groups/readEvents";
const READ_EVENT_DETAILS = "groups/readEventDetails";
const CREATE_EVENT = "groups/createEvent";
const ADD_EVENTIMAGE = "groups/addEventImage";
const DELETE_EVENT = "groups/deleteEvent";

//action creators
const readEvents = (events) => ({
  type: READ_EVENTS,
  payload: events,
});

const readEventDetails = (eventDetails) => ({
  type: READ_EVENT_DETAILS,
  payload: eventDetails,
});

const createEvent = (event) => ({
  type: CREATE_EVENT,
  event,
});

const addEventImage = (eventId, image) => ({
  type: ADD_EVENTIMAGE,
  eventId,
  image,
});

const deleteEvent = (eventId) => ({
  type: DELETE_EVENT,
  eventId,
});

// Events fetch
export const fetchAllEvents = () => async (dispatch) => {
  const response = await csrfFetch("/api/events");
  const data = await response.json();
  dispatch(readEvents(data.Events));
};

//Events details
export const fetchEventDetails = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`);
  if (response.ok) {
    const eventDetails = await response.json();
    dispatch(readEventDetails(eventDetails));
  } else {
    throw new Error("Unable to fetch event Details");
  }
};

//Events create
export const createEventFunc = (groupId, event) => async (dispatch) => {
  //   console.log("EVENT", event);
  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });
  if (response.ok) {
    const newEvent = await response.json();
    dispatch(createEvent(newEvent));
    return newEvent;
  } else {
    throw new Error("Unable to Create");
  }
};

//Add event image
export const addEventImageFunc = (eventId, image) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(image),
  });
  if (response.ok) {
    const event = await response.json();
    await dispatch(addEventImage(eventId, image));
    return event;
  } else {
    throw new Error("Unable to Add");
  }
};

//delete event
export const deleteEventFunc = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(deleteEvent(eventId));
    return response.json();
  } else {
    throw new Error("Unable to Delete");
  }
};

const initialState = {
  list: [],
  eventDetails: [],
};

//Reducer
const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case READ_EVENTS:
      return { ...state, list: action.payload };
    case READ_EVENT_DETAILS:
      return { ...state, eventDetails: action.payload };
    case CREATE_EVENT: {
      return {
        ...state,
        [action.event.id]: action.event,
      };
    }
    case ADD_EVENTIMAGE: {
      const { eventId, image } = action;
      return {
        ...state,
        [eventId]: {
          ...state[eventId],
          Eventimages: state[eventId]?.Eventimages
            ? [...state[eventId].Eventimages, image]
            : [image],
        },
      };
    }
    case DELETE_EVENT: {
      const { list } = state;
      const updatedList = list.filter((event) => event.id !== action.eventId);
      return { ...state, list: updatedList, eventDetails: null };
    }
    default:
      return state;
  }
};

export default eventsReducer;
