import { combineReducers } from "redux";
import { user } from "./user";
import { notification } from "./notification";
import { travelgroupReducer } from "./travelgroupReducer";
import { travelplanReducer } from "./travelPlanReducer";

export default combineReducers({
  user,
  notification,
  groups: travelgroupReducer,
  plans: travelplanReducer,
});
