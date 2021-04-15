import axios from "axios";

import { GROUP_SERVICE } from "../../config/urls";
import { useDispatch, useSelector } from "react-redux";

export const CREATE_NEW_GROUP = "CREATE_NEW_GROUP";
export const GET_GROUPS_USER_IN = "GET_GROUPS_USER_IN";
export const GET_SINGLE_GROUP_BY_ID = "GET_SINGLE_GROUP_BY_ID";
export const ADD_MANAGER = "ADD_MANAGER";
export const ADD_MEMBER = "ADD_MEMBER";
export const DOWNGRADE_MANAGER = "DOWNGRADE_MANAGER";
export const DELETE_MEMBER_OR_MANAGER = "DELETE_MEMBER_OR_MANAGER";
export const DELETE_GROUP_BY_ID = "DELETE_GROUP_BY_ID";
export const SET_CURRENTGROUP = "SET_CURRENTGROUP";
export const SUSPEND_GROUP_BY_ID = "SUSPEND_GROUP_BY_ID";
export const UPDATE_GROUP = "UPDATE_GROUP"; // for admin user
export const CLEAR_TRAVELGROUP = "CLEAR_TRAVELGROUP";
export const CLEAR_CURRGROUP = "CLEAR_CURRGROUP";

export const setGroupsUserIn = (groups) => {
  return {
    type: UPDATE_GROUP,
    payload: groups,
  };
};

export const setCurrentGroup = (currGroup) => {
  return {
    type: SET_CURRENTGROUP,
    payload: currGroup,
  };
};

export const clearTravelgroup = () => {
  return {
    type: CLEAR_TRAVELGROUP,
  };
};

export const clearCurrGroup = () => {
  return {
    type: CLEAR_CURRGROUP,
  };
};
