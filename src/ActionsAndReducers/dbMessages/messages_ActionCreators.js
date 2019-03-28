import ActionConstant from '../ActionConstants';
import 'whatwg-fetch';
import check from 'check-types';

import { addMessage,
         getAllMessagesFromDB,
         getMessageFromDB,
         updateMessageInDB,
         duplicateMessageDB,
         deleteMessageDB } from '../../pouchDB/dbMessages';

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


export const duplicateMessage = (messageId) => {

  if (!check.string(messageId)) throw Error(`duplicateMessage() requires a string Not. ${messageId}`);

  return async (dispatch) => {
    dispatch(loadingDBMessageCreate(true));

    var result = await duplicateMessageDB(messageId);

    if (result) {
      dispatch(DBMessageSaveStatus(result));
      let messages = await getAllMessagesFromDB();
      dispatch(DBSaveMessageArray(messages));
    }
    dispatch(loadingDBMessageCreate(false));
  }
};


export const updateMessage = (message, id) => {

  if (!check.object(message)) throw Error(`updateMessage() requires object with message, from & to NOT. ${message}`);

  return async (dispatch) => {
    dispatch(loadingDBMessageCreate(true));

    const result = await updateMessageInDB(message, id);

    if (result) {
      dispatch(DBMessageSaveStatus(result));

      let responses = await Promise.all([getAllMessagesFromDB(), getMessageFromDB(result.id)]);
      let [messages, message] = [...responses];

      dispatch(DBSaveMessagePreview(message));
      dispatch(DBSaveMessageArray(messages));

    } else {
      // create error message
    }
    dispatch(loadingDBMessageCreate(false));
  }
};

export const deleteMessage = (messageId) => {

  if (!check.string(messageId)) throw Error(`duplicateMessage() requires a string Not. ${messageId}`);

  return async (dispatch) => {
    dispatch(loadingDBMessageCreate(true));

    var result = await deleteMessageDB(messageId);

    if (result) {
      let messages = await getAllMessagesFromDB();
      dispatch(DBSaveMessageArray(messages));
      dispatch(resetMessagePreview());
    } else {
      // error action
    }

    dispatch(loadingDBMessageCreate(false));
  }
};

export const getSingleMessage = (id) => {

  if (!check.string(id)) throw Error(`duplicateMessage() requires a string id..`);

  return async (dispatch) => {
    dispatch(loadingDBMessageGet(true));

    let result = await getMessageFromDB(id);

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