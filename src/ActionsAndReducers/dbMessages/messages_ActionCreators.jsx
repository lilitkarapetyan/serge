import ActionConstant from '../ActionConstants';
import 'whatwg-fetch';
import check from 'check-types';

import { addMessage, getAllMessages } from '../../pouchDB/dbMessageTypes';

const DBMessageSaveStatus = (status) => ({
  type: ActionConstant.DB_MESSAGE_STATUS,
  payload: status
});

const DBSaveMessageArray = (messages) => ({
  type: ActionConstant.DB_MESSAGE_TYPES_SAVED,
  payload: messages
});

const loadingDBMessageCreate = (isLoading) => ({
  type: ActionConstant.DB_MESSAGE_CREATION_LOADING,
  isLoading
});

const loadingDBMessageGet = (isLoading) => ({
  type: ActionConstant.DB_MESSAGE_TYPES_GET,
  isLoading
});

export const createMessageType = (message) => {

  if (!check.object(message)) throw Error(`createMessageType() requires object with message, from & to NOT. ${message}`);

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

export const getAllMessageTypes = () => {
  return async (dispatch) => {
    dispatch(loadingDBMessageGet(true));

    let result = await getAllMessages();

    dispatch(DBSaveMessageArray(result));
    dispatch(loadingDBMessageGet(false));
  }
};