import { applyMiddleware, combineReducers, createStore } from 'redux';
import { messageTypesReducer } from "../ActionsAndReducers/dbMessageTypes/messageTypes_Reducer";
import { messagesReducer } from "../ActionsAndReducers/dbMessages/messages_Reducer";
import { currentModal } from "../ActionsAndReducers/Modal/Modal_Reducer";
import { currentViewURIReducer } from "../ActionsAndReducers/setCurrentViewFromURI/setCurrentViewURI_Reducer";
import { umpireMenuReducer } from "../ActionsAndReducers/UmpireMenu/umpireMenu_Reducer";
import { wargamesReducer } from "../ActionsAndReducers/dbWargames/wargames_Reducer";
import { notificationReducer } from "../ActionsAndReducers/Notification/Notification_Reducer";
import { playerUiReducer } from "../ActionsAndReducers/playerUi/playerUi_Reducer";
import { loadingDbReducer } from "../ActionsAndReducers/loadingDb_Reducer";

import ActionConstants from "../ActionsAndReducers/ActionConstants";

import thunk from 'redux-thunk';

const middlewares = [thunk];

const stopActions = store => next => action => {

  switch (action.type) {
    case ActionConstants.SET_CURRENT_WARGAME_PLAYER:
      if (
        action.payload.gameTurn !== store.getState().playerUi.currentTurn ||
        action.payload.name !== store.getState().playerUi.currentWargame ||
        action.payload.wargameInitiated !== store.getState().playerUi.wargameInitiated
      ) {
        next(action);
      }
      break;

    case ActionConstants.SET_FEEDBACK_MESSAGES:
      if (action.payload.length > store.getState().playerUi.feedbackMessages.length) {
        next(action);
      }
      break;

    case ActionConstants.SET_LATEST_MESSAGES:
      if (action.payload.length > store.getState().playerUi.allMessages.length) {
        next(action);
      }
      break;

    default:
      next(action);
      break;
  }
};

middlewares.push(stopActions);

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);
  middlewares.push(logger);
}

export default createStore(combineReducers({
  messageTypes: messageTypesReducer,
  messages: messagesReducer,
  umpireMenu: umpireMenuReducer,
  currentViewURI: currentViewURIReducer,
  currentModal,
  notifications: notificationReducer,
  wargame: wargamesReducer,
  playerUi: playerUiReducer,
  dbLoading: loadingDbReducer,
}), applyMiddleware(...middlewares));
