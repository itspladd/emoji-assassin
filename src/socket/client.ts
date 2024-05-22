import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

// @ts-expect-error The URL parameter causes a TS issue that's not super important right now
export const socket = io(URL, { autoConnect: false });