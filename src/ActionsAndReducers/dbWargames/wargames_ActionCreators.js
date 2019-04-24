import ActionConstant from '../ActionConstants';
import 'whatwg-fetch';
import check from 'check-types';
import _ from "lodash";

import * as wargamesApi from "../../api/wargames_api";

import { apiPath, headers } from "../../pouchDB/consts";


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


export const setSelectedChannel = (payload) => ({
  type: ActionConstant.SET_SELECTED_CHANNEL,
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


export const populateWargameStore = () => {
  return async (dispatch) => {

    var wargameNames = await wargamesApi.populateWargame();

    dispatch(saveAllWargameNames(wargameNames));
  }
};


export const createNewWargameDB = () => {

  return async (dispatch) => {

    var wargame = await wargamesApi.createWargame();

    dispatch(setCurrentWargame(_.omit(wargame, ['_id', '_rev'])));
  }
};



export const editWargame = (name) => {
  return async (dispatch) => {

    let wargame = await wargamesApi.editWargame(name);

    dispatch(setCurrentWargame(wargame));
  }
};



export const updateWargame = (dbName, data, title) => {

  return async (dispatch) => {

    let localDoc = await wargamesApi.updateWargame(dbName, data, title);
    dispatch(setCurrentWargame(localDoc));

  }
};


export const duplicateWargame = (dbName) => {
  return async (dispatch) => {

    var games = await wargamesApi.duplicateWargame(dbName);

    console.log(games);

    dispatch(saveAllWargameNames(games));
  }
};

