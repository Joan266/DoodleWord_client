const SET_PHASE_1 = 'SET_PHASE_1';
const SET_PHASE_2 = 'SET_PHASE_2';
const SET_PHASE_0 = 'SET_PHASE_0';
const SET_LOADING = 'SET_LOADING';

const initialPhaseState = {
  phase: 0,
  loading: false, 
};

const phaseReducer = (state, action) => {
  switch (action.type) {
    case SET_PHASE_1:
      return { ...state, phase: 1 };
    case SET_PHASE_2:
      return { ...state, phase: state.phase === 1 ? 2 : state.phase };
    case SET_PHASE_0:
      return { ...state, phase:  0 };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export {
  SET_PHASE_1,
  SET_PHASE_2,
  SET_PHASE_0,
  SET_LOADING,
  phaseReducer,
  initialPhaseState,
};
