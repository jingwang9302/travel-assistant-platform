<<<<<<< HEAD
import { combineReducers } from "redux";
import { user } from "./user";

import { travelgroupReducer } from "./travelgroupReducer";
import { travelplanReducer } from "./travelPlanReducer";
import { errorReducer } from "./errorReducer";

export default combineReducers({
  user,
  groups: travelgroupReducer,
  plans: travelplanReducer,
});
=======
import {combineReducers} from 'redux'
import {user} from './user'
import {notification} from "./notification";

export default combineReducers({user, notification})
>>>>>>> 428ffa77c845ced0f1bf9b52f65c3ac48d0867cd
