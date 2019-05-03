import ActionConstant from '../ActionConstants.js';
import uniqid from "uniqid";
import {unsavedState} from "../dbWargames/wargames_ActionCreators";

export const addNotification = (payload) => ({
  type: ActionConstant.ADD_NOTIFICATION,
  payload: {
    message: payload,
    id: uniqid.time(),
  },
});

export const hide = (id) => ({
  type: ActionConstant.HIDE_NOTIFICATION,
  id
});


export const hideNotification = (id) => {
  return (dispatch) => {

    dispatch(hide(id));
    dispatch(unsavedState(false));

  };
};
