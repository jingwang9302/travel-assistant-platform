import {
  UPDATE_PLANS,
  ClEAR_PLANS,
  ADD_DEPARTURE_PLACE,
  ADD_DESTINATION_PLACE,
  REMOVE_DEPARTURE_PLACE,
  REMOVE_DESTINATION_PLACE,
  CLEAR_DEPARTURE_AND_DESTINATION,
  SET_DEPARTURE_AND_DESTINATION,
  ADD_GROUP_FOR_PLAN_PUBLISH,
  REMOVE_GROUP_FOR_PLAN_PUBLISH,
  SET_ONGOING_PLAN,
  REMOVE_ONGOING_PLAN,
} from "../actions/travelPlanAction";

const initialState = {
  plans: [],
  draftPlan: [],
  departureAddress: {},
  destinationAddress: [],
  selectedGroupForPlanPublish: "",
  ongoingPlan: null,
};

export const travelplanReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PLANS:
      return { ...state, plans: action.payload };
    // clear all plan related states after logout
    case ClEAR_PLANS:
      return {};
    case CLEAR_DEPARTURE_AND_DESTINATION:
      return { ...state, departureAddress: {}, destinationAddress: [] };
    case ADD_DEPARTURE_PLACE:
      return { ...state, departureAddress: action.payload };
    case ADD_DESTINATION_PLACE:
      if (!state.destinationAddress || state.destinationAddress.length === 0) {
        const destinationAddress = [];
        destinationAddress.push(action.payload);
        return {
          ...state,
          destinationAddress,
        };
      }
      return {
        ...state,
        destinationAddress: [...state.destinationAddress, action.payload],
      };
    case REMOVE_DEPARTURE_PLACE:
      return { ...state, departureAddress: {} };
    case REMOVE_DESTINATION_PLACE:
      return {
        ...state,
        destinationAddress: state.destinationAddress.filter(
          (item) => item.placeId !== action.payload
        ),
      };
    case SET_DEPARTURE_AND_DESTINATION:
      return {
        ...state,
        departureAddress: action.payload.departureAddress
          ? action.payload.departureAddress
          : {},
        destinationAddress: action.payload.destinationAddress
          ? action.payload.destinationAddress
          : [],
      };
    case ADD_GROUP_FOR_PLAN_PUBLISH:
      return {
        ...state,
        selectedGroupForPlanPublish: action.payload,
      };

    case REMOVE_GROUP_FOR_PLAN_PUBLISH:
      return {
        ...state,
        selectedGroupForPlanPublish: "",
      };

    case SET_ONGOING_PLAN:
      return {
        ...state,
        ongoingPlan: action.payload,
      };
    case REMOVE_ONGOING_PLAN:
      return {
        ...state,
        ongoingPlan: null,
      };
    default:
      return state;
  }
};
