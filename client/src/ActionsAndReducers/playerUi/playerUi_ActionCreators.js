import ActionConstant from '../ActionConstants';
import * as wargamesApi from "../../api/wargames_api";
import * as messageTemplatesApi from "../../api/messageTypes_api";
import {modalAction} from "../../ActionsAndReducers/Modal/Modal_ActionCreators";

export const setCurrentWargame = (data) => ({
  type: ActionConstant.SET_CURRENT_WARGAME_PLAYER,
  payload: data
});

export const setForce = (data) => ({
  type: ActionConstant.SET_FORCE,
  payload: data
});

export const showHideObjectives = () => ({
  type: ActionConstant.SHOW_HIDE_OBJECTIVES,
});

export const setRole = (data) => ({
  type: ActionConstant.SET_ROLE,
  payload: data
});

export const setWargameFeedback = (messages) => ({
  type: ActionConstant.SET_FEEDBACK_MESSAGES,
  payload: messages,
});

export const setWargameMessages = (messages) => ({
  type: ActionConstant.SET_LATEST_MESSAGES,
  payload: messages,
});

export const transformTemplates = (wargame, messages) => {
  wargame.data.channels.channels.forEach((channel) => {
    channel.participants.forEach((participant) => {
      let templateSchemas = [];
      participant.templates.forEach((templateInfo) => {
        let templateIndex = messages.findIndex((template) => template._id === templateInfo.value);
        if (templateIndex > -1) templateSchemas.push(messages[templateIndex]);
        if (templateIndex === -1) throw new Error("Template not found");
      });
      participant.templates = templateSchemas;
    })
  });
  return wargame;
};

export const getWargame = (gamePath) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.getWargame(gamePath);
    let messages = await messageTemplatesApi.getAllMessagesFromDb();

    let transformedWargame = transformTemplates(wargame, messages);

    dispatch(setCurrentWargame(transformedWargame));
  }
};

export const nextGameTurn = (dbName) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.nextGameTurn(dbName);
    let messages = await messageTemplatesApi.getAllMessagesFromDb();

    let transformedWargame = transformTemplates(wargame, messages);

    dispatch(setCurrentWargame(transformedWargame));
  }
};


export const initiateGame = (dbName) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.initiateGame(dbName);
    let messages = await messageTemplatesApi.getAllMessagesFromDb();

    let transformedWargame = transformTemplates(wargame, messages);

    dispatch(setCurrentWargame(transformedWargame));
  }
};


export const sendFeedbackMessage = (dbName, playerInfo, message) => {
  return async (dispatch) => {

    await wargamesApi.postFeedback(dbName, playerInfo, message);

    dispatch(modalAction.close());
  }
};

export const saveMessage = (dbName, details, message) => {
  return async (dispatch) => {

    await wargamesApi.postNewMessage(dbName, details, message);

    let messages = await wargamesApi.getAllMessages(dbName);

    messages = messages.filter((message) => !message.hasOwnProperty('feedback'));

    dispatch(setWargameMessages(messages));
  }
};

export const getAllWargameFeedback = (dbName) => {
  return async (dispatch) => {

    let messages = await wargamesApi.getAllMessages(dbName);
    messages = messages.filter((message) => message.hasOwnProperty('feedback'));

    dispatch(setWargameFeedback(messages));
  }
};

export const getAllWargameMessages = (name) => {
  return async (dispatch) => {

    let messages = await wargamesApi.getAllMessages(name);

    messages = messages.filter((message) => !message.hasOwnProperty('feedback'));

    dispatch(setWargameMessages(messages));
  }
};
