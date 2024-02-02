const SET_ARTIST_ID = 'SET_ARTIST_ID';
const SET_WORD = 'SET_WORD';
const SET_WORD_INDICES = 'SET_WORD_INDICES';
const SET_RANDOM_WORDS = 'SET_RANDOM_WORDS';
const SET_IS_WORD = 'SET_IS_WORD';
const SET_ROUND = 'SET_ROUND';
const initialGameState = {
  _id: String,
  artistId: String,
  word: {},
  round:1,
  isWord: false,
  randomWords: [],
  wordIndices: [],
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case SET_ARTIST_ID:
      return { ...state, artistId: action.payload };
    case SET_WORD:
    return { ...state, word: action.payload };
    case SET_WORD_INDICES:
    return { ...state, wordIndices: action.payload };
    case SET_RANDOM_WORDS:
    return { ...state, randomWords: action.payload };
    case SET_IS_WORD:
    return { ...state, isWord: action.payload };
    case SET_ROUND:
    return { ...state, round: action.payload };
    default:
      return state;
  }
};

export { SET_WORD_INDICES, SET_ROUND, SET_IS_WORD, SET_RANDOM_WORDS, SET_WORD, SET_ARTIST_ID, initialGameState, gameReducer };
