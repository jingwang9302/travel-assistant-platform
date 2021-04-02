import {
  CREATE_NEW_GROUP,
  GET_GROUPS_USER_IN,
  GET_SINGLE_GROUP_BY_ID,
  ADD_MANAGER,
  ADD_MEMBER,
  DOWNGRADE_MANAGER,
  DELETE_MEMBER_OR_MANAGER,
  DELETE_GROUP,
  SUSPEND_GROUP_BY_ID,
  SET_CURRENTGROUP,
  UPDATE_GROUP,
  CLEAR_TRAVELGROUP,
  CLEAR_CURRGROUP,
} from "../actions/travelgroupAction";

const initialState = {
  groups: [],
  //usersInGroup
  currGroup: {},
};

export const travelgroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GROUP:
      return { ...state, groups: action.payload };
    case SET_CURRENTGROUP:
      return { ...state, currGroup: action.payload };
    case CLEAR_TRAVELGROUP:
      return { ...state, groups: [], currGroup: {} };
    case CLEAR_CURRGROUP:
      return { ...state, currGroup: {} };
    default:
      return state;
  }
};
