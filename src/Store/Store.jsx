import { applyMiddleware, combineReducers, createStore } from 'redux';
import { messageTypesReducer } from "../ActionsAndReducers/dbMessageTypes/messageTypes_Reducer";
import { messagesReducer } from "../ActionsAndReducers/dbMessages/messages_Reducer";
import { curOpenMessageReducer } from "../ActionsAndReducers/setOpenMessage/setOpenMessage_Reducer";
import { setCurrentViewURIReducer } from "../ActionsAndReducers/setCurrentViewFromURI/setCurrentViewURI_Reducer";
import { selectedSchemaReducer } from "../ActionsAndReducers/selectedSchema/selectedSchema_Reducer";

import thunk from 'redux-thunk';

const middlewares = [thunk];

// if (process.env.NODE_ENV === `development`) {
//   const { logger } = require(`redux-logger`);
//   middlewares.push(logger);
// }


export default createStore(combineReducers({
  messageTypes: messageTypesReducer,
  messages: messagesReducer,
  curOpenMessageId: curOpenMessageReducer,
  currentViewURI: setCurrentViewURIReducer,
  selectedSchema: selectedSchemaReducer,
}), applyMiddleware(...middlewares));