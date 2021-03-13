export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const SET_READ = 'SET_READ';
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';

export function setNotifications(notifications) {
    return {
        type: SET_NOTIFICATIONS,
        payload: notifications
    }
}

export function addNotification(notification) {
    return {
        type: ADD_NOTIFICATION,
        payload: notification
    }
}

export function setRead(id) {
    return {
        type: SET_READ,
        payload: id
    }
}

export function clearNotifications() {
    return {
        type: CLEAR_NOTIFICATIONS
    }
}