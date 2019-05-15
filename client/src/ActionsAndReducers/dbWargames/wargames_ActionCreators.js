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

export const setTabSaved = () => ({
  type: ActionConstant.SET_TAB_SAVED
});

export const setTabUnsaved = () => ({
  type: ActionConstant.SET_TAB_UNSAVED
});

export const setSelectedForce = (payload) => ({
  type: ActionConstant.SET_SELECTED_FORCE,
  payload
});


export const addNewChannel = (data) => ({
  type: ActionConstant.ADD_NEW_CHANNEL,
  payload: data,
});

export const addNewForce = (data) => ({
  type: ActionConstant.ADD_NEW_FORCE,
  payload: data,
});

export const setSelectedChannel = (payload) => ({
  type: ActionConstant.SET_SELECTED_CHANNEL,
  payload
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

export const addRole = (force, role) => ({
  type: ActionConstant.ADD_ROLE_TO_FORCE,
  payload: {
    force,
    role,
  }
});

export const updateRole = (force, oldName, role) => ({
  type: ActionConstant.UPDATE_ROLE_NAME,
  payload: {
    force,
    oldName,
    role,
  }
});

export const removeRole = (role) => ({
  type: ActionConstant.REMOVE_ROLE,
  role,
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

    var wargame = await wargamesApi.createWargame(dispatch);

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

    dispatch(setCurrentWargame(wargame));
  }
};

export const refreshChannel = (dbName, selectedChannel) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.getWargameLocalFromName(dbName);

    let wargameIsInProgress = await wargamesApi.checkIfWargameStarted(dbName);

    if (wargameIsInProgress) {
      await wargamesApi.createLatestWargameRevision(dbName, wargame);
    }

    wargame.data.channels.selectedChannel = selectedChannel;

    dispatch(setCurrentWargame(wargame));
  }
};


export const saveWargameTitle = (dbName, title) => {

  return async (dispatch) => {

    let wargame = await wargamesApi.updateWargameTitle(dbName, title);

    let wargameIsInProgress = await wargamesApi.checkIfWargameStarted(dbName);

    if (wargameIsInProgress) {
      await wargamesApi.createLatestWargameRevision(dbName, wargame);
    }

    let wargames = await wargamesApi.getAllWargames();

    dispatch(saveAllWargameNames(wargames));

    dispatch(setCurrentWargame(wargame));

    dispatch(addNotification("Wargame name updated.", "success"));

  }
};


export const saveSettings = (dbName, data) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.saveSettings(dbName, data);

    let wargameIsInProgress = await wargamesApi.checkIfWargameStarted(dbName);

    if (wargameIsInProgress) {
      await wargamesApi.createLatestWargameRevision(dbName, wargame);
    }

    dispatch(setCurrentWargame(wargame));

    dispatch(setTabSaved());

    dispatch(addNotification("Overview saved.", "success"));
  }
};

export const saveForce = (dbName, newName, newData, oldName) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.saveForce(dbName, newName, newData, oldName);

    let wargameIsInProgress = await wargamesApi.checkIfWargameStarted(dbName);

    if (wargameIsInProgress) {
      await wargamesApi.createLatestWargameRevision(dbName, wargame);
    }

    dispatch(setCurrentWargame(wargame));
    dispatch(setTabSaved());
    dispatch(setSelectedForce(newName));

    dispatch(addNotification("Force saved.", "success"));
  }
};

export const saveChannel = (dbName, newName, newData, oldName) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.saveChannel(dbName, newName, newData, oldName);

    let wargameIsInProgress = await wargamesApi.checkIfWargameStarted(dbName);

    if (wargameIsInProgress) {
      await wargamesApi.createLatestWargameRevision(dbName, wargame);
    }

    dispatch(setCurrentWargame(wargame));
    dispatch(setSelectedChannel(newName));

    dispatch(addNotification("channel saved.", "success"));
  }
};

export const deleteSelectedChannel = (dbName, channel) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.deleteChannel(dbName, channel);

    let wargameIsInProgress = await wargamesApi.checkIfWargameStarted(dbName);

    if (wargameIsInProgress) {
      await wargamesApi.createLatestWargameRevision(dbName, wargame);
    }

    dispatch(setCurrentWargame(wargame));

    dispatch(addNotification("Channel deleted.", "warning"));
  }
};

export const deleteSelectedForce = (dbName, force) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.deleteForce(dbName, force);

    let wargameIsInProgress = await wargamesApi.checkIfWargameStarted(dbName);

    if (wargameIsInProgress) {
      await wargamesApi.createLatestWargameRevision(dbName, wargame);
    }

    dispatch(setCurrentWargame(wargame));

    dispatch(addNotification("Force deleted.", "warning"));
  }
};


export const duplicateWargame = (dbName) => {
  return async (dispatch) => {

    var games = await wargamesApi.duplicateWargame(dbName);

    dispatch(saveAllWargameNames(games));
  }
};

