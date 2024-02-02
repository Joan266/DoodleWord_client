import React, { useRef } from 'react';
import styles from '../Room.module.scss'; 
import { socket } from '../../socket.js';
import { useUserContext, useGameContext, usePhaseContext, useGameDispatch } from '../context.js';

const ChatInput = () => {
  const textRef = useRef(null);
  const userContext = useUserContext();
  const gameContext = useGameContext();
  const phaseContext = usePhaseContext();
  const gameDispatch = useGameDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = textRef.current.value.trim(); // Convert to lowercase and remove leading/trailing spaces
    textRef.current.value = '';
    if (text === '') return;
    
    if ( phaseContext.phase === 2 && !phaseContext.loading) {
      const lowercaseWord = gameContext.word.name.toLowerCase();
      const lowercaseText = text.toLowerCase();
      const isWord = lowercaseWord === lowercaseText;
      if(isWord) {
        if(!gameContext.isWord && userContext._id !== gameContext.artistId) {
        gameDispatch({ type: 'SET_IS_WORD', payload: true });
        socket.emit("game_client:user_scored", { userId: userContext._id, gameId: gameContext._id } );
        } 
        return;
      }
    }
    socket.emit("chat_client:add_message", { ...userContext, text } );
  };

  return (
    <form className={styles.chatInput} onSubmit={handleSubmit}>
      <input
        type="text"
        name="chatInput"
        placeholder=" Type something.."
        ref={textRef}
      />
    </form>
  );
};

export default ChatInput;
