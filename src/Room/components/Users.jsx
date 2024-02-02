import React, { useReducer, useEffect } from 'react';
import { usePhaseContext,  useRoomContext, useGameContext, useTimerDispatch } from "../context.js";
import { socket } from '../../socket.js';
import styles from '../Room.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faPaintBrush } from '@fortawesome/free-solid-svg-icons';
import { faStar} from '@fortawesome/free-regular-svg-icons';
import PlayButton from './PlayButton.jsx';

const ADD_USER = 'ADD_USER';
const REMOVE_USER = 'REMOVE_USER';
const ADD_SCORE = 'ADD_SCORE';
const RESET_USERS_SCORES = 'RESET_USERS_SCORES';

// Reducer function
const usersReducer = (state, action) => {
  switch (action.type) {
    case ADD_USER:
    // Check if a user with the same ID already exists
    const existingUser = state.usersArray.find(user => user._id === action.user._id);

    if (existingUser) {
      // User with the same ID already exists, return the state as it is
      console.log(`user: ${action.user} exist`)
      return state;
    } else {
      // No user with the same ID, add the new user
      const newUser = { ...action.user, score: 0 };
      return {
        ...state,
        usersArray: [...state.usersArray, newUser],
      };
   }
    case REMOVE_USER:
      return {
        ...state,
        usersArray: state.usersArray.filter(user => user._id !== action.userId),
      };
    case ADD_SCORE:
      if (action.score <= 0) {
        // Validation for positive score
        return state;
      }
      return {
        ...state,
        usersArray: state.usersArray.map(user =>
          user._id === action.userId ? { ...user, score: user.score + action.score } : user
        ),
      };
    case RESET_USERS_SCORES:
      return {
        ...state,
        usersArray: state.usersArray.map(user => ({
          ...user,
          score: 0,
        })),
      };
    default:
      return state;
  }
};

const Users = ({ initialUsers }) => {
  const [state, dispatch] = useReducer(usersReducer, {
    usersArray: initialUsers.map((user, index) => ({
      ...user,
      score: 0,
    })),
  });
  const { phase } = usePhaseContext();
  const room = useRoomContext();
  const { artistId } = useGameContext();
  const timerDispatch = useTimerDispatch();
  useEffect(()=>{
    if(phase === 0){
      dispatch({
        type: RESET_USERS_SCORES,
      });
    }
  },[phase])
  useEffect(() => {
    const handleUserJoin = (data) => {
      const { user } = data;
      console.log('User joined:', user);
      dispatch({
        type: ADD_USER,
        user: user,
      });
    };
    const handleUserLeave = (data) => {
      const { userId } = data;
      console.log('User leaved:', userId);
      dispatch({
        type: REMOVE_USER,
        userId: userId,
      });
    };
    const handleUserScored = (data) => {
      const { score, userId } = data;
      console.log(`User ${userId} scored: ${score}`);
      dispatch({
        type: ADD_SCORE,
        score: score,
        userId: userId,
      });
    };

    if (socket) {
      socket.on('user:join', handleUserJoin);
      socket.on('user:leave', handleUserLeave);
      socket.on('game_server:user_scored', handleUserScored);
    }

    return () => {
      if (socket) {
        socket.off('user:join', handleUserJoin);
        socket.off('user:leave', handleUserLeave);
        socket.off('game_server:user_scored', handleUserScored);
      }
    };
  }, []);

  useEffect(()=>{
    const clockTimePhase2 = (state.usersArray.length - 1) * 60;
    timerDispatch({type:'SET_CLOCK_TIME_PHASE_2', clockTimePhase2})
  },[state.usersArray.length, timerDispatch])

  const sortUsers = (a, b) => {
    if (phase === 0) {
      // Sort by owner first in phase 0
      return a._id === room.owner ? -1 : 1;
    } else if (phase >= 1 && phase <= 3) {
      return b.score - a.score;
    }
  };
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={styles.usersContainer}
    >
      {state.usersArray
        .sort((a, b) => sortUsers(a, b))
        .map((user, index) => (
          <div key={index} className={styles.customToast}>
            <div className={styles.customToastHeader}>
              <div className={`${styles.nameContainer}`} style={{ bacgroundColor: user.color }}>
                {user.name}
              </div>
              {(phase >= 1 && phase <= 3) && artistId === user._id ? <FontAwesomeIcon icon={faPaintBrush} className="rounded me-2" /> : <FontAwesomeIcon icon={faPaintBrush} className="rounded me-2" style={{ color: 'white' }}/> }
              {user._id === room.owner && phase === 0 ? <FontAwesomeIcon icon={faCrown} className="rounded me-2" /> : ''}
              {phase >= 1 && phase <= 3 ? (
                <>
                  <span>{user.score * 100} <FontAwesomeIcon icon={faStar} className="rounded me-2" /></span>
                  <span>#{index + 1}</span>
                </>
              ) : (
                null 
              )}
            </div>
          </div>
        ))
      }
      <PlayButton usersCount={state.usersArray.length}/>
    </div>
  );
};

export default Users;
