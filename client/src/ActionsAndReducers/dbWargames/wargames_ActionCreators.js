import ActionConstant from '../ActionConstants';
import 'whatwg-fetch';
import _ from "lodash";

import * as wargamesApi from "../../api/wargames_api";
import { addNotification } from "../Notification/Notification_ActionCreators";

export const setCurrentTab = (tab) => ({
  type: ActionConstant.SET_CURRENT_GAME_SETUP_TAB,
  payload: tab
});

export const setGameData = (data) => ({
  type: ActionConstant.SET_GAME_SETUP_DATA,
  payload: data,
});

export const setWargameTitle = (data) => ({
  type: ActionConstant.SET_WARGAME_NAME,
  payload: data,
});

export const gameTitleInvalid = (data) => ({
  type: ActionConstant.GAME_TITLE_INVALID,
  payload: data,
});

export const addNewForce = (data) => ({
  type: ActionConstant.ADD_NEW_FORCE,
  payload: data,
});

export const setSelectedForce = (payload) => ({
  type: ActionConstant.SET_SELECTED_FORCE,
  payload
});


export const addNewChannel = (data) => ({
  type: ActionConstant.ADD_NEW_CHANNEL,
  payload: data,
});

export const updateChannelName = (name) => ({
  type: ActionConstant.UPDATE_CHANNEL_NAME,
  name,
});

export const setSelectedChannel = (payload) => ({
  type: ActionConstant.SET_SELECTED_CHANNEL,
  payload
});

export const deleteSelectedChannel = (payload) => ({
  type: ActionConstant.DELETE_SELECTED_CHANNEL,
  payload
});


export const setForceOverview = (payload) => ({
  type: ActionConstant.SET_FORCE_OVERVIEW,
  payload,
});


const saveAllWargameNames = (names) => ({
  type: ActionConstant.ALL_WARGAME_NAMES_SAVED,
  payload: names
});


const setCurrentWargame = (data) => ({
  type: ActionConstant.SET_CURRENT_WARGAME,
  payload: data
});


export const addRecipientToChannel = (data) => ({
  type: ActionConstant.ADD_NEW_RECIPIENT,
  payload: data,
});

export const updateRecipient = (id, data) => ({
  type: ActionConstant.UPDATE_RECIPIENT,
  payload: { id,data }
});

export const removeRecipient = (id) => ({
  type: ActionConstant.REMOVE_RECIPIENT,
  payload: id
});

const populatingDb = (isLoading) => ({
  type: ActionConstant.POPULATE_WARGAMES_DB,
  isLoading
});

export const unsavedState = (unsaved) => ({
  type: ActionConstant.SET_UNSAVED_STATE,
  unsaved
});


export const populateWargameStore = () => {
  return async (dispatch) => {

    dispatch(populatingDb(true));

    var wargameNames = await wargamesApi.populateWargame(dispatch);

    dispatch(saveAllWargameNames(wargameNames));

    dispatch(populatingDb(false));
  }
};


export const createNewWargameDB = () => {

  return async (dispatch) => {

    var wargame = await wargamesApi.createWargame();

    let wargames = await wargamesApi.getAllWargames();

    dispatch(saveAllWargameNames(wargames));

    dispatch(setCurrentWargame(_.omit(wargame, ['_id', '_rev'])));
  }
};


export const clearWargames = () => {

  return async (dispatch) => {

    await wargamesApi.clearWargames();

    let wargames = await wargamesApi.getAllWargames();
    dispatch(saveAllWargameNames(wargames));

  }
};


export const deleteWargame = (name) => {
  return async (dispatch) => {

    await wargamesApi.deleteWargame(name);

    let wargames = await wargamesApi.getAllWargames();
    dispatch(saveAllWargameNames(wargames));

  }
};


export const editWargame = (name) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.editWargame(name);

    dispatch(unsavedState(false));
    dispatch(setCurrentWargame(wargame));
  }
};



export const updateWargame = (dbName, data, title) => {

  return async (dispatch) => {

    let localDoc = await wargamesApi.updateWargame(dbName, data, title);

    let wargames = await wargamesApi.getAllWargames();

    dispatch(saveAllWargameNames(wargames));

    dispatch(setCurrentWargame(localDoc));

    dispatch(unsavedState(false));
    dispatch(addNotification("wargame saved."));

  }
};

export const saveChannel = (wargameName, newName, newData, oldName) => {
  return async (dispatch) => {

    let localDoc = await wargamesApi.saveChannel(wargameName, newName, newData, oldName);

    dispatch(setCurrentWargame(localDoc));
    dispatch(setSelectedChannel(newName));

    dispatch(addNotification("channel saved."));

  }
};


export const duplicateWargame = (dbName) => {
  return async (dispatch) => {

    var games = await wargamesApi.duplicateWargame(dbName);

    dispatch(saveAllWargameNames(games));
  }
};

