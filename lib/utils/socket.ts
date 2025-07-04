import { io } from "socket.io-client";

const WS_URL = "https://feedflow-server-2.onrender.com";
export const socket = io(WS_URL);
