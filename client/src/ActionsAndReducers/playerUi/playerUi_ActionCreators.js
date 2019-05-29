import ActionConstant from '../ActionConstants';
import * as wargamesApi from "../../api/wargames_api";
import * as messageTemplatesApi from "../../api/messageTypes_api";

export const setCurrentWargame = (data) => ({
  type: ActionConstant.SET_CURRENT_WARGAME_PLAYER,
  payload: data
});

export const setForce = (data) => ({
  type: ActionConstant.SET_FORCE,
  payload: data
});

export const setRole = (data) => ({
  type: ActionConstant.SET_ROLE,
  payload: data
});

export const setFilteredChannels = (setSelectedChannel) => ({
  type: ActionConstant.SET_FILTERED_CHANNELS,
  setSelectedChannel
});

export const setChannel = (data) => ({
  type: ActionConstant.SET_CHANNEL,
  payload: data,
});

export const setMessageSchema = (schema) => ({
  type: ActionConstant.SET_MESSAGE_SCHEMA,
  payload: schema,
});

export const setWargameMessages = (messages) => ({
  type: ActionConstant.SET_LATEST_MESSAGES,
  payload: messages,
});

export const getWargame = (gamePath) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.getWargame(gamePath);

    dispatch(setCurrentWargame(wargame));
  }
};

export const nextGameTurn = (dbName) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.nextGameTurn(dbName);

    dispatch(setCurrentWargame(wargame));
  }
};


export const initiateGame = (dbName) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.initiateGame(dbName);

    dispatch(setCurrentWargame(wargame));
  }
};


export const saveMessage = (dbName, details, message) => {
  return async (dispatch) => {

    await wargamesApi.postNewMessage(dbName, details, message);

    let messages = await wargamesApi.getAllMessages(dbName);

    // messages = messages.filter((message) => !message.hasOwnProperty('infoType'));

    dispatch(setWargameMessages(messages));
  }
};

export const getMessageTemplate = (id) => {
  return async (dispatch) => {
    let messages = await messageTemplatesApi.getAllMessagesFromDb();

    var template = messages.find((message) => message._id === id);

    dispatch(setMessageSchema(template.details));
  }
};

export const getAllWargameMessages = (name) => {
  return async (dispatch) => {

    var messages = await wargamesApi.getAllMessages(name);

    // messages = messages.filter((message) => !message.hasOwnProperty('infoType'));

    dispatch(setWargameMessages(messages));
  }
};
