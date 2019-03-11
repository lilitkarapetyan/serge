import ActionConstant from '../ActionConstants';
import 'whatwg-fetch';
import check from 'check-types';

import { addMessage, getAllMessages } from '../../pouchDB/db';

const DBMessageSaveStatus = (status) => ({
  type: ActionConstant.DB_MESSAGE_STATUS,
  payload: status
});

const DBSaveMessageArray = (messages) => ({
  type: ActionConstant.DB_SAVE_MESSAGES,
  payload: messages
});

const loadingDBMessageCreate = (isLoading) => ({
  type: ActionConstant.DB_MESSAGE_CREATION_LOADING,
  isLoading
});

const loadingDBMessageGet = (isLoading) => ({
  type: ActionConstant.DB_MESSAGE_GET_LOADING,
  isLoading
});

export const createDBMessage = (message) => {

  if (!check.object(message)) throw `createDBMessage() requires object with message, from & to NOT. ${message}`;

  return async (dispatch) => {
    dispatch(loadingDBMessageCreate(true));

    var result = await addMessage(message);

    if (result.ok) {
      dispatch(DBMessageSaveStatus(result));
      let messages = await getAllMessages();
      dispatch(DBSaveMessageArray(messages));
    }

    dispatch(loadingDBMessageCreate(false));
  }
};

export const retrieveAllMessages = () => {
  return async (dispatch) => {
    dispatch(loadingDBMessageGet(true));

    let result = await getAllMessages();

    dispatch(DBSaveMessageArray(result));
    dispatch(loadingDBMessageGet(false));
  }
};