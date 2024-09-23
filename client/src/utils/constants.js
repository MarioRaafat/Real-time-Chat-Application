export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTE = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const GET_USER_INFO = `${AUTH_ROUTE}/user-info`;
export const UPDATE_USER_INFO = `${AUTH_ROUTE}/update-user-info`;
export const ADD_PROFILE_IMG = `${AUTH_ROUTE}/add-profile-image`;
export const DELETE_PROFILE_IMG = `${AUTH_ROUTE}/delete-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`;


export const CONTACT_ROUTE = "api/contacts";

export const GET_CONTACTS_ROUTE = `${CONTACT_ROUTE}/get-contacts`;
export const ADD_CONTACT_ROUTE = `${CONTACT_ROUTE}/add-contact`;
export const DELETE_CONTACT_ROUTE = `${CONTACT_ROUTE}/delete-contact`;
export const UPDATE_CONTACT_ROUTE = `${CONTACT_ROUTE}/update-contact`;