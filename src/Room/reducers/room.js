const SET_OWNER = 'SET_OWNER';

const roomReducer = (state, action) => {
  switch (action.type) {
    case SET_OWNER:
      return { ...state, owner: action.payload };
    default:
      return state;
  }
};

export {
  SET_OWNER,
  roomReducer,
};
