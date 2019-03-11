import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createMessageReducer } from "../ActionsAndReducers/pouchDb/pouchDb_Reducer";
import { retrieveAllMessagesReducer } from "../ActionsAndReducers/pouchDb/pouchDbAllMessages_Reducer";
import thunk from 'redux-thunk';

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);
  middlewares.push(logger);
}


export default createStore(combineReducers({
  messageSendStatus: createMessageReducer,
  allMessages: retrieveAllMessagesReducer,
}), applyMiddleware(...middlewares));