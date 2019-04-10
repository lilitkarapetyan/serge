import ActionConstant from '../ActionConstants';
import 'whatwg-fetch';
import check from 'check-types';

import {
  createNewWargame,
  addToDB,
  fetchFromDB,
  populateDbStore,
  getAllWargameNames
} from '../../pouchDB/dbWargames';


// const DBWargameStatus = (status) => ({
//   type: ActionConstant.DB_MESSAGE_STATUS,
//   payload: status
// });
//
// const DBSaveMessageArray = (messages) => ({
//   type: ActionConstant.DB_MESSAGE_TYPES_SAVED,
//   payload: messages
// });
//
// const loadingDBMessageCreate = (isLoading) => ({
//   type: ActionConstant.DB_MESSAGE_CREATION_LOADING,
//   isLoading
// });
//
// const loadingDBMessageGet = (isLoading) => ({
//   type: ActionConstant.DB_MESSAGE_TYPES_GET,
//   isLoading
// });

const saveAllWargameNames = (names) => ({
  type: ActionConstant.ALL_WARGAME_NAMES_SAVED,
  payload: names
});

const selectedWargameData = (data) => ({
  type: ActionConstant.SELECTED_WARGAME_DATA,
  payload: data
});


export const populateWargameStore = () => {
  return async (dispatch) => {
    var result = await populateDbStore();
    dispatch(saveAllWargameNames(result));
  }
};


export const createNewWargameDB = (name) => {

  if (!check.string(name)) throw Error(`createNewWargameDB() requires a string name.`);

  return async (dispatch) => {

    // dispatch(loadingDBMessageCreate(true));

    try {

      var result = await createNewWargame(name);

      console.log(result);
      // if (result.ok) {
      //   dispatch(DBMessageSaveStatus(result));
      //   let messages = await getAllMessagesFromDB();
      //   dispatch(DBSaveMessageArray(messages));
      // }
      // dispatch(loadingDBMessageCreate(false));

    } catch (err) {
      alert(err);
      console.log(err);
    }
  }
};

export const addToWargame = (name) => {
  return async (dispatch) => {

    var result = await addToDB(name);
    console.log(result);
  }
};

export const getAllWargames = () => {
  return async (dispatch) => {

    var result = await getAllWargameNames();
    dispatch(saveAllWargameNames(result));

  }
};

export const getAllDataFromWargame = (name) => {
  return async (dispatch) => {

    var result = await fetchFromDB(name);

    dispatch(selectedWargameData(result));
  }
};
