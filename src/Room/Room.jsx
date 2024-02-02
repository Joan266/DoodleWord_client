import React, { useEffect, useReducer } from "react";
import Board from "./components/Board.jsx";
import GameInfo from "./components/GameInfo";
import RoomInfo from "./components/RoomInfo";
import Users from "./components/Users"
import ChatInput from "./components/ChatInput"
import Chat from "./components/Chat"
import { socket } from "../socket.js";
import { useLocation } from 'react-router-dom';
import { MyProviders } from './context.js';
import styles from './Room.module.scss';
import { Spinner } from 'react-bootstrap';
// Define initial state for the reducer
const initialState = {
  loading: true,
  error: null,
  socketConnected: false,
};

// Define actions for the reducer
const actionTypes = {
  CONNECT_SOCKET: 'CONNECT_SOCKET',
  SET_DATA: 'SET_DATA',
  SET_ERROR: 'SET_ERROR',
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.CONNECT_SOCKET:
      return { ...state, socketConnected: action.payload, loading: false };
    case actionTypes.SET_DATA:
      return { ...state, ...action.payload, loading: false };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const Room = () => {
  const location = useLocation();
  const { user, users, room, game } = location.state;
  const [state, dispatch] = useReducer(reducer, initialState);
  const screenWidth = window.innerWidth;
  useEffect(() => {
    if (!room) {
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Room not found' });
      return;
    }
    if (!socket.connected) {
      // Connect the socket only if it's not already connected
      socket.connect();
    }
    socket.on("connect", () => {
      socket.emit("room:join", { code: room.code, user,roomId: room._id });
      dispatch({ type: actionTypes.CONNECT_SOCKET, payload: true });
    });
    socket.on("connect_error", (error) => {
      dispatch({ type: actionTypes.SET_ERROR, payload: `Socket connection: ${error.message}` });
    });
    return () => {
      socket.disconnect();
    };
  }, [ room, user ]);

  if (state.loading) {
    // Loading screen
    return <div className={styles.room}><div className={styles.topBackground}></div>
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
      variant="light"
    /></div>;
  }

  if (state.error || !state.socketConnected) {
    // Error screen
    return (
      <div className={styles.room}>
        <div className={styles.topBackground}></div>
        <span style={{ fontSize: "36px", fontWeight: "bold", color: "red" }}>
          {state.error}
        </span>
      </div>
    );
  }
  return (
    <MyProviders initialState={{ room, user, game }}>
      <div className={styles.room}>
        {screenWidth > 768 && <div className={styles.topBackground}></div>}
        <div className={styles.container}>
          <div className={styles.leftContainer}>
            <RoomInfo />
            <Users initialUsers={users} />
          </div>
          <div className={styles.centerContainer}>
            <GameInfo />
            <Board />
          </div>
          <div className={styles.rightContainer}>
            <Chat />
            <ChatInput />
          </div>
        </div>
      </div>
    </MyProviders>
  );
};

export default Room;

