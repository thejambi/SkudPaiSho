// User identity functions.
// Reads from localStorage, no game state dependencies.

import { LocalStorage } from './LocalStorage';

const localStorage = new LocalStorage().storage;

export const usernameKey = "usernameKey";
export const userEmailKey = "userEmailKey";
export const userIdKey = "userIdKey";
export const deviceIdKey = "deviceIdKey";
export const localEmailKey = "localUserEmail";

export function getUserId() {
	return localStorage.getItem(userIdKey);
}

export function getUsername() {
	return localStorage.getItem(usernameKey);
}

export function getDeviceId() {
	return localStorage.getItem(deviceIdKey);
}

export function getUserEmail() {
	return localStorage.getItem(userEmailKey);
}

export function userIsLoggedIn() {
	return getUserId() &&
		getUsername() &&
		getUserEmail() &&
		getDeviceId();
}

export function usernameEquals(otherUsername) {
	return otherUsername && getUsername() && otherUsername.toLowerCase() === getUsername().toLowerCase();
}

export function usernameIsOneOf(theseNames) {
	if (theseNames && theseNames.length) {
		for (let i = 0; i < theseNames.length; i++) {
			if (getUsername() && getUsername().toLowerCase() === theseNames[i].toLowerCase()) {
				return true;
			}
		}
	}
	return false;
}

export function getLoginToken() {
	return {
		userId: getUserId(),
		username: getUsername(),
		userEmail: getUserEmail(),
		deviceId: getDeviceId()
	};
}

export function haveUserEmail() {
	const userEmail = localStorage.getItem(localEmailKey);
	return userEmail && userEmail.includes("@") && userEmail.includes(".");
}
