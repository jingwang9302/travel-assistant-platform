export const UPDATE_PLANS = "UPDATE_PLANS";
export const ClEAR_PLANS = "CLEAR_PLANS";
export const UPDATE_DRAFT_PLAN = "UPDATE_DRAFT_PLAN";
export const ADD_DEPARTURE_PLACE = "ADD_DEPARTURE_PLACE";
export const ADD_DESTINATION_PLACE = "ADD_DESTINATION_PLACE";
export const REMOVE_DEPARTURE_PLACE = "REMOVE_DEPARTURE_PLACE";
export const REMOVE_DESTINATION_PLACE = "REMOVE_DESTINATION_PLACE";
export const CLEAR_DEPARTURE_AND_DESTINATION =
  "CLEAR_DEPARTURE_AND_DESTINATION";
export const SET_DEPARTURE_AND_DESTINATION = "SET_DEPARTUR_AND_DESTINATION";
export const ADD_GROUP_FOR_PLAN_PUBLISH = "ADD_GROUP_FOR_PLAN_PUBLISH";
export const REMOVE_GROUP_FOR_PLAN_PUBLISH = "REMOVE_GROUP_FOR_PLAN_PUBLISH";
export const SET_ONGOING_PLAN = "SET_ONGOING_PLAN";
export const REMOVE_ONGOING_PLAN = "REMOVE_ONGOING_PLAN";

export const setPlans = (plans) => {
  return {
    type: UPDATE_PLANS,
    payload: plans,
  };
};
export const clearDepartureAndDestinationAddress = () => {
  return {
    type: CLEAR_DEPARTURE_AND_DESTINATION,
  };
};

export const clearPlans = () => {
  return {
    type: ClEAR_PLANS,
  };
};

export const addDestinationPlace = (place) => {
  return {
    type: ADD_DESTINATION_PLACE,
    payload: place,
  };
};

export const addDeparturePlace = (place) => {
  return {
    type: ADD_DEPARTURE_PLACE,
    payload: place,
  };
};

export const removeDeparturPlace = () => {
  return {
    type: REMOVE_DEPARTURE_PLACE,
  };
};
export const removeDestinationPlace = (placeId) => {
  return {
    type: REMOVE_DESTINATION_PLACE,
    payload: placeId,
  };
};

export const setDepartureAndDestination = (plan) => {
  return {
    type: SET_DEPARTURE_AND_DESTINATION,
    payload: plan,
  };
};

export const addGroupForPlanPublish = (groupId) => {
  return {
    type: ADD_GROUP_FOR_PLAN_PUBLISH,
    payload: groupId,
  };
};

export const removeGroupForPlanPublish = () => {
  return {
    type: REMOVE_GROUP_FOR_PLAN_PUBLISH,
  };
};

export const setOngoingPlan = (plan) => {
  return {
    type: SET_ONGOING_PLAN,
    payload: plan,
  };
};

export const removeOngoingPlan = () => {
  return {
    type: REMOVE_ONGOING_PLAN,
  };
};
