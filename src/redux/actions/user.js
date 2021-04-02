export const SET_LOGIN = 'SET_LOGIN';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_PROFILE = 'SET_PROFILE';
export const SET_AVATAR = 'SET_AVATAR';
export const SET_LOGOUT = 'SET_LOGOUT';

export function setLogin(isLogin) {
    return {
        type: SET_LOGIN,
        payload: isLogin
    }
}

export function setToken(token) {
    return {
        type: SET_TOKEN,
        payload: token
    }
}

export function setProfile(profile) {
    return {
        type: SET_PROFILE,
        payload: profile
    }
}

export function setAvatar(avatarUrl) {
    return {
        type: SET_AVATAR,
        payload: avatarUrl
    }
}

export function setLogout(){
    return{
        type: SET_LOGOUT
    }
}