import ActionConstant from '../ActionConstants.js';
import copyState from "../copyStateHelper.js";

const initialState = {
  open: false,
  message: '',
};

export const notificationReducer = (state = initialState, action) => {

    let newState = copyState(state);

    switch (action.type) {
      case ActionConstant.SHOW_NOTIFICATION:
        newState = action.payload;
        return newState;

      case ActionConstant.HIDE_NOTIFICATION:
        newState = action.payload;
        return newState;

      default:
        return newState;
    }
};
