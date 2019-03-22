import ActionConstant from '../ActionConstants';
import 'whatwg-fetch';
import check from 'check-types';

import { addMessage, getAllMessagesFromDB, getMessageFromDB } from '../../pouchDB/dbMessages';

const DBMessageSaveStatus = (status) => ({
  type: ActionConstant.DB_MESSAGE_STATUS,
  payload: status
});

const DBSaveMessageArray = (messages) => ({
  type: ActionConstant.DB_MESSAGE_SAVED,
  payload: messages
});

const DBSaveMessagePreview = (message) => ({
  type: ActionConstant.DB_RETURNED_MESSAGE,
  payload: message
});

const loadingDBMessageCreate = (isLoading) => ({
  type: ActionConstant.DB_MESSAGE_CREATION_LOADING,
  isLoading
});

const loadingDBMessageGet = (isLoading) => ({
  type: ActionConstant.DB_MESSAGES_GET,
  isLoading
});

export const resetMessagePreview = () => ({
  type: ActionConstant.RESET_MESSAGE_PREVIEW,
});


/*
 * - below are async getters
 */

export const createMessage = (message, schemaId) => {

  if (!check.object(message)) throw Error(`createMessageType() requires object with message, from & to NOT. ${message}`);

  return async (dispatch) => {
    dispatch(loadingDBMessageCreate(true));

    var result = await addMessage(message, schemaId);

    if (result.ok) {
      dispatch(DBMessageSaveStatus(result));
      let messages = await getAllMessagesFromDB();
      dispatch(DBSaveMessageArray(messages));
    }

    dispatch(loadingDBMessageCreate(false));
  }
};

export const getSingleMessage = (id) => {
  return async (dispatch) => {
    dispatch(loadingDBMessageGet(true));

    let result = await getMessageFromDB(id);

    console.log(result);

    dispatch(DBSaveMessagePreview(result));
    dispatch(loadingDBMessageGet(false));
  }
};

export const getAllMessages = () => {
  return async (dispatch) => {
    dispatch(loadingDBMessageGet(true));

    let result = await getAllMessagesFromDB();

    dispatch(DBSaveMessageArray(result));
    dispatch(loadingDBMessageGet(false));
  }
};