import ActionConstant from '../ActionConstants';
import 'whatwg-fetch';
import check from 'check-types';

import {
  addMessageType,
  getAllMessagesFromDB,
  updateMessageTypeInDB,
  duplicateMessageTypeDB,
  deleteMessageTypeDB
} from '../../pouchDB/dbMessageTypes';

import {setCurrentViewFromURI} from "../setCurrentViewFromURI/setCurrentViewURI_ActionCreators";

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

export const createMessageType = (schema) => {

  if (!check.object(schema)) throw Error(`createMessageType() requires schema object & NOT. ${schema}`);

  return async (dispatch) => {

    dispatch(loadingDBMessageCreate(true));

    try {

      var result = await addMessageType(schema);

      if (result.ok) {
        dispatch(DBMessageSaveStatus(result));
        let messages = await getAllMessagesFromDB();
        dispatch(DBSaveMessageArray(messages));
      }
      dispatch(loadingDBMessageCreate(false));
      dispatch(setCurrentViewFromURI("/umpireMenu/templates"));

    } catch (err) {
      alert(err);
      console.log(err);
    }
  }
};


export const duplicateMessageType = (id) => {

  if (!check.string(id)) throw Error(`duplicateTemplate() requires a string Not. ${id}`);

  return async (dispatch) => {
    dispatch(loadingDBMessageCreate(true));

    var result = await duplicateMessageTypeDB(id);

    if (result) {
      dispatch(DBMessageSaveStatus(true));
      let messages = await getAllMessagesFromDB();
      dispatch(DBSaveMessageArray(messages));
    }
    dispatch(loadingDBMessageCreate(false));
  }
};


export const updateMessageType = (schema, id) => {

  if (!check.object(schema)) throw Error(`updateMessageType() requires schema & not ${schema}`);

  return async (dispatch) => {
    dispatch(loadingDBMessageCreate(true));

    try {
      const result = await updateMessageTypeInDB(schema, id);

      if (result) {
        dispatch(DBMessageSaveStatus(result));

        let allMessages = await getAllMessagesFromDB();

        dispatch(DBSaveMessageArray(allMessages));
        dispatch(loadingDBMessageCreate(false));
        dispatch(setCurrentViewFromURI("/umpireMenu/templates"));

      }
    } catch (e) {
      // CREATE ERROR WARNING MESSAGE
      dispatch(loadingDBMessageCreate(false));
      alert(e);
    }
  }
};


export const deleteMessageType = (messageId) => {

  if (!check.string(messageId)) throw Error(`deleteMessage() requires a string of id not. ${messageId}`);

  return async (dispatch) => {
    dispatch(loadingDBMessageCreate(true));

    var result = await deleteMessageTypeDB(messageId);

    if (result) {
      let messages = await getAllMessagesFromDB();
      dispatch(DBSaveMessageArray(messages));
    } else {
      // error action
    }

    dispatch(loadingDBMessageCreate(false));
  }
};


export const getAllMessageTypes = () => {
  return async (dispatch) => {
    dispatch(loadingDBMessageGet(true));

    let result = await getAllMessagesFromDB();

    dispatch(DBSaveMessageArray(result));
    dispatch(loadingDBMessageGet(false));
  }
};