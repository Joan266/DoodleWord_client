const START = 'START';
const STOP = 'STOP';
const RESET = 'RESET';
const TICK = 'TICK';
const REDUCE_TIME = 'REDUCE_TIME';
const SET_CLOCK_TIME_PHASE_2 = 'SET_CLOCK_TIME_PHASE_2';
const initialTimerState = {
  count: 15,
  clockTimePhase1: 15,
  clockTimePhase2: Number,
  isPlaying: false,
};

const timerReducer = (state, action) => {
  switch (action.type) {
    case START:
      return { ...state, isPlaying: true };
    case STOP:
      return { ...state, isPlaying: false };
    case TICK:
      if((state.count - 1) < 0 || state.isPlaying === false) return state;
      return { ...state, count: state.count - 1 };
    case REDUCE_TIME:
      if(state.count === 0) return state;
      if((state.count - 60) <= 0) return { ...state, count: 0 };
      return { ...state, count: state.count - 60 };
    case RESET:
      if(action.clockTimePhase1) return { ...state, count: state.clockTimePhase1, isPlaying: false };
      if(action.clockTimePhase2) return { ...state, count: state.clockTimePhase2, isPlaying: false };
      return { ...state, count: state.clockTimePhase1, isPlaying: false };
    case SET_CLOCK_TIME_PHASE_2:
      return { ...state, clockTimePhase2: action.clockTimePhase2 };
    default:
      return state;
  }
};

export { SET_CLOCK_TIME_PHASE_2, REDUCE_TIME, START, STOP, TICK, RESET, initialTimerState, timerReducer };
