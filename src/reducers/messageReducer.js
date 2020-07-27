import * as actionTypes from '../actions/messageActions';

const initialState = {
  status: '',
  text: '',
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.SET_STATUS_MESSAGE: {
    return {
      ...state,
      status: action.status,
      text: action.text,
    };
  }

  case actionTypes.REMOVE_STATUS_MESSAGE: {
    return {
      ...state,
      status: '',
      text: '',
    };
  }

  default: {
    return state;
  }

  }
};

export default messageReducer;
