import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

// @ts-expect-error If it's undefined, we get one overload. If it's a string, we get the other.
export const socket = io(URL);