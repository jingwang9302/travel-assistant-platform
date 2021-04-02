import { UPDATE_ERRORS, CLEAR_ERRORS } from "../actions/errorAction";

const initialState = {};
export const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
};
