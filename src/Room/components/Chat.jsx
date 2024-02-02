import React, { useEffect, useReducer } from 'react';
import styles from '../Room.module.scss';
import { socket } from '../../socket.js';

const ADD_MESSAGE = 'ADD_MESSAGE';

// Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        chatText: [ action.payload, ...state.chatText ], // Use spread operator to correctly add new message
      };
    default:
      return state;
  }
};

const Chat = () => {
  const [state, dispatch] = useReducer(chatReducer, { chatText: [] }); // Initialize chatText as an array

  useEffect(() => {
    const handleAddMessage = (data) => {
      const { color, name, text } = data;
      const message = {color, name, text};
      dispatch({
        type: ADD_MESSAGE,
        payload: message,
      });
    };

    if (socket) {
      socket.on('chat_server:add_message', handleAddMessage);
    }

    return () => {
      if (socket) {
        socket.off('chat_server:add_message', handleAddMessage);
      }
    };
  }, []);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.content}>
        {state.chatText.map((message, index) => (
          <div key={index} className={styles.message} >
            <strong style={{ color: message.color }}> {message.name}: </strong>
            {message.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
