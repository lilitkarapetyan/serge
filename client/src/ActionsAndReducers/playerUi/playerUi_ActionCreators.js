import ActionConstant from '../ActionConstants';
import * as wargamesApi from "../../api/wargames_api";
import * as messageTemplatesApi from "../../api/messageTypes_api";

const setCurrentWargame = (data) => ({
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

export const setFilteredChannels = () => ({
  type: ActionConstant.SET_FILTERED_CHANNELS,
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

export const getWargame = () => {
  return async (dispatch) => {

    await wargamesApi.populateWargame();

    // will get active wargame during later stages
    let wargame = await wargamesApi.getWargame();
    dispatch(setCurrentWargame(wargame));
  }
};

export const saveMessage = (dbName, details, message) => {
  return async (dispatch) => {

    await wargamesApi.postNewMessage(dbName, details, message);

    let wargame = await wargamesApi.getWargame();
    let messages = await wargamesApi.getAllMessages(wargame.name);

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

export const getAllMessages = () => {
  return async (dispatch) => {

    var wargame = await wargamesApi.getWargame();

    var messages = await wargamesApi.getAllMessages(wargame.name);

    dispatch(setWargameMessages(messages));
  }
};
