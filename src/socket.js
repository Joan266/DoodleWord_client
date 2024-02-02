import { io } from 'socket.io-client';
const { NODE_ENV, REACT_APP_SOCKET_URL, REACT_APP_PORT } = process.env;
const URL = NODE_ENV === 'production' ? REACT_APP_SOCKET_URL : `http://localhost:${REACT_APP_PORT}`;
export const socket = io(URL, {
  autoConnect: false,
  closeOnBeforeunload: true,
});