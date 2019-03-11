import ActionConstant from '../ActionConstants';
import copyState from "../copyStateHelper.js";

var initialState = {
  isLoading: false,
  messages: [],
};

export const retrieveAllMessagesReducer = (state = initialState, action) => {

  var newState = copyState(state);

  switch (action.type) {
    case ActionConstant.DB_MESSAGE_GET_LOADING:
      newState.isLoading = action.isLoading;
      return newState;

    case ActionConstant.DB_SAVE_MESSAGES:
      newState.messages = action.payload.rows;
      return newState;

    default:
      return newState;
  }
};