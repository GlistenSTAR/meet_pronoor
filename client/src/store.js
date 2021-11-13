import { readable, writable } from 'svelte/store';

export const apiURL = readable("http://localhost:7000/api");
export const socketURL = readable("http://localhost:7000");

export const user = writable([]);
export const selectedFriend = writable([]);
export const friends = writable([]);
export const isAuthenticated = writable(false);
export const errors = writable({});
export const messages = writable([]);