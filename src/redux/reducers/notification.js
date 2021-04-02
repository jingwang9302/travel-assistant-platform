import {ADD_NOTIFICATION, CLEAR_NOTIFICATIONS, SET_NOTIFICATIONS, SET_READ} from "../actions/notification";

// notifications:[
//     {
//         id:0,
//         type: '',
//         title: '',
//         content: '',
//         timestamp: '',
//         read: false
//     },
//     {
//         id:1,
//         type: '',
//         title: '',
//         content: '',
//         timestamp: '',
//         read: false
//     }
// ]

const initialState = {
    notifications:[]
}

export function notification(state=initialState,action) {

    switch (action.type) {
        case SET_NOTIFICATIONS:
            return {...state, notifications: action.payload}
        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [...state.notifications, action.payload]
            }
        case SET_READ: {
            const index = state.notifications.findIndex(notification => notification.id === action.payload);
            const newArray = [...state.notifications];
            newArray[index].read = true
            return {...state, notifications: newArray }
        }
        case CLEAR_NOTIFICATIONS: {
            return {
                notifications:[]
            }
        }
        default:
            return state;
    }
}


