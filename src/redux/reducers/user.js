import {
    SET_LOGOUT,
    SET_LOGIN,
    SET_PROFILE,
    SET_TOKEN, SET_AVATAR
} from "../actions/user";

const initialState = {
    id:0,
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    avatarUrl: '',
    token: '',
    isLogin: false
}

export function user(state=initialState,action) {

    switch (action.type) {
        case SET_LOGIN:
            return {...state, isLogin: action.payload}
        case SET_TOKEN:
            return {...state, token: action.payload}
        case SET_PROFILE:
            return {...state,
                id: action.payload.id,
                email: action.payload.email,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                address: action.payload.address,
                phone: action.payload.phone
            }
        case SET_AVATAR:
            return {...state, avatarUrl: action.payload}
        case SET_LOGOUT:
            return {
                id:0,
                email: '',
                firstName: '',
                lastName: '',
                address: '',
                phone: '',
                avatarUrl: '',
                token: '',
                isLogin: false
            }
        default:
            return state;
    }
}


