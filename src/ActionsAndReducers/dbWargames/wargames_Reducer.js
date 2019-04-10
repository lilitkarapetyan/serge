import ActionConstant from '../ActionConstants';
import copyState from "../copyStateHelper.js";

var initialState = {
  isLoading: false,
  wargameNames: [],
  selectedWargame: {}
};

export const wargamesReducer = (state = initialState, action) => {

  var newState = copyState(state);

  switch (action.type) {

    case ActionConstant.ALL_WARGAME_NAMES_SAVED:
      newState.wargameNames = action.payload;
      return newState;

    case ActionConstant.SELECTED_WARGAME_DATA:
      newState.selectedWargame = action.payload;
      return newState;

    default:
      return newState;
  }
};
