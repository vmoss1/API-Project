import { csrfFetch } from "./csrf";

//actions
const READ_GROUPS = "groups/readGroups";
const READ_GROUP_DETAILS = "groups/readGroupDetails";
// const READ_GROUP_EVENTS = "groups/readGroupEvents";
// const CREATE_GROUP = "groups/createGroup";
// const ADD_GROUPIMAGE = "groups/addGroupImage";
// const DELETE_GROUP = "groups/deleteGroup";
// const UPDATE_GROUP = "groups/updateGroup";

//action creators
const readGroups = (groups) => ({
  type: READ_GROUPS,
  payload: groups,
});

const readGroupDetails = (groupDetails) => ({
  type: READ_GROUP_DETAILS,
  payload: groupDetails,
});

// const readGroupEvents = (events) => ({
//   type: READ_GROUP_EVENTS,
//   payload: events,
// });

// const createGroup = (group) => ({
//   type: CREATE_GROUP,
//   group,
// });

// const addGroupImage = (groupId, image) => ({
//   type: ADD_GROUPIMAGE,
//   groupId,
//   image,
// });

// const deleteGroup = (groupId) => ({
//   type: DELETE_GROUP,
//   groupId,
// });

// const updateGroup = (group) => ({
//   type: UPDATE_GROUP,
//   group,
// });

// Group-fetch thunk
export const fetchAllGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");
  const data = await response.json();
  dispatch(readGroups(data.Groups));
};

export const fetchGroupDetails = (groupId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}`);
    if (response.ok) {
      const groupDetails = await response.json();
      dispatch(readGroupDetails(groupDetails));
    } else {
      throw new Error("Unable to fetch group Details");
    }
  } catch (e) {
    console.log(e);
  }
};

const initialState = {
  list: [],
  groupDetails: null,
  groupEvents: [],
};

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case READ_GROUPS:
      return { ...state, list: action.payload };
    case READ_GROUP_DETAILS:
      return { ...state, groupDetails: action.payload };
    default:
      return state;
  }
};

export default groupsReducer;
