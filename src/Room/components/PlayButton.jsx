import React from 'react';
import { usePhaseContext, useUserContext, useRoomContext, usePhaseDispatch } from "../context.js";
import { socket } from '../../socket.js';
import styles from '../Room.module.scss';

const PlayButton = ({usersCount}) => {
  const { phase } = usePhaseContext();
  const user = useUserContext();
  const room = useRoomContext();
  const phaseDispatch = usePhaseDispatch();
  const handlePlayButton = () => {
    console.log("game_client:start_game");
    phaseDispatch({ type: 'SET_LOADING', payload: true });
  
    try {
      socket.emit("game_client:start_game", { roomId: room._id });
    } catch (error) {
      console.error("Error emitting socket event:", error);
    }
  }
  return (
    <>
    {phase === 0 && usersCount > 1 ? (
        <div className={styles.footerButton}>
          <button
                className={phase !== 0 || !(user._id === room.owner)|| phase.loading ? styles.disabled : ''}
                onClick={handlePlayButton}
                disabled={phase !== 0 || !(user._id === room.owner) || phase.loading}
              >
                Play
          </button>
        </div>
        ) : (
          ""
        )}
    </>
  );
};

export default PlayButton;
