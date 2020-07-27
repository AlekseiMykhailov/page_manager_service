import { combineReducers } from 'redux';
import sessionReducer from './sessionReducer';
import messageReducer from './messageReducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  message: messageReducer,
});

export default rootReducer;
