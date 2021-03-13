// Define URLs

// Backend system url
export const BASE_URL = 'http://192.168.1.21:8080';

// Each service entrypoint
export const USER_SERVICE = BASE_URL + '/user/api/user';
export const LOGIN_URL = BASE_URL + '/login';
export const NOTIFICATION_SERVICE = BASE_URL + '/notification/api/notification';
export const NOTIFICATION_WEBSOCKET_SERVICE = BASE_URL + '/notification-ws/notification';