import { csrfFetch } from "./csrf";

//actions
const READ_GROUPS = "groups/readGroups";
const READ_GROUP_DETAILS = "groups/readGroupDetails";
const READ_GROUP_EVENTS = "groups/readGroupEvents";
const CREATE_GROUP = "groups/createGroup";
const ADD_GROUPIMAGE = "groups/addGroupImage";
const DELETE_GROUP = "groups/deleteGroup";
const UPDATE_GROUP = "groups/updateGroup";

//action creators
const readGroups = (groups) => ({
  type: READ_GROUPS,
  payload: groups,
});

const readGroupDetails = (groupDetails) => ({
  type: READ_GROUP_DETAILS,
  payload: groupDetails,
});

const readGroupEvents = (events) => ({
  type: READ_GROUP_EVENTS,
  payload: events,
});

const createGroup = (group) => ({
  type: CREATE_GROUP,
  group,
});

const addGroupImage = (groupId, image) => ({
  type: ADD_GROUPIMAGE,
  groupId,
  image,
});

const deleteGroup = (groupId) => ({
  type: DELETE_GROUP,
  groupId,
});

const updateGroup = (group) => ({
  type: UPDATE_GROUP,
  group,
});

// Thunk functions

// Group fetch
export const fetchAllGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");
  const data = await response.json();
  dispatch(readGroups(data.Groups));
};

// Group details fetch
export const fetchGroupDetails = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`);
  if (response.ok) {
    const groupDetails = await response.json();
    dispatch(readGroupDetails(groupDetails));
  } else {
    throw new Error("Unable to fetch group Details");
  }
};

// Group Events fetch
export const fetchGroupEvents = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`);
  if (response.ok) {
    const { Events } = await response.json();
    dispatch(readGroupEvents(Events));
  } else {
    throw new Error("Group events fetch failed");
  }
};

//Create new group
export const createGroupFunc = (group) => async (dispatch) => {
  const response = await csrfFetch("/api/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(group),
  });
  if (response.ok) {
    const newGroup = await response.json();
    dispatch(createGroup(newGroup));
    return newGroup;
  } else {
    throw new Error("Unable to Create");
  }
};

// add group image
export const addGroupImageFunc = (groupId, image) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(image),
  });
  if (response.ok) {
    const group = await response.json();
    await dispatch(addGroupImage(groupId, image));
    return group;
  } else {
    throw new Error("Unable to Add");
  }
};

//delete group
export const deleteGroupFunc = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(deleteGroup(groupId));
    return response.json();
  } else {
    throw new Error("Unable to Delete");
  }
};

//update group
export const updateGroupFunc = (groupId, groupData) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupData),
  });
  if (response.ok) {
    const editedGroup = await response.json();
    dispatch(updateGroup(editedGroup));
    return editedGroup;
  } else {
    throw new Error("Unable to Update");
  }
};

const initialState = {
  list: [],
  groupDetails: [],
  groupEvents: [],
};

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case READ_GROUPS:
      return { ...state, list: action.payload };
    case READ_GROUP_DETAILS:
      return { ...state, groupDetails: action.payload };
    case READ_GROUP_EVENTS:
      return { ...state, groupEvents: action.payload };
    case CREATE_GROUP: {
      const groupsState = { ...state };
      groupsState[action.group.id] = action.group;
      return groupsState;
    }
    case ADD_GROUPIMAGE: {
      const { groupId, image } = action;
      return {
        ...state,
        [groupId]: {
          ...state[groupId],
          Groupimages: state[groupId]?.Groupimages
            ? [...state[groupId].Groupimages, image]
            : [image],
        },
      };
    }
    case DELETE_GROUP: {
      const { list } = state;
      const updatedList = list.filter((group) => group.id !== action.groupId);
      return { ...state, list: updatedList, groupDetails: null };
    }
    case UPDATE_GROUP: {
      return {
        ...state,
        list: state.list.map((group) =>
          group.id === action.group.id ? action.group : group
        ),
        groupDetails: action.group,
      };
    }
    default:
      return state;
  }
};

export default groupsReducer;
