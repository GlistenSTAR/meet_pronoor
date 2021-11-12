import { readable, writable } from 'svelte/store';

export const apiURL = readable("http://localhost:7000/api");

export const user = writable([]);
export const isAuthenticated = writable(false);
export const errors = writable({});