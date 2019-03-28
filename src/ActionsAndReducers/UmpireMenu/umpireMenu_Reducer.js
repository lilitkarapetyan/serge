import ActionConstant from '../ActionConstants';
import deepCopy from "../copyStateHelper.js";

const initialState = {
  selectedSchemaID: '',
  currentViewURI: '',
  currentOpenMessageSchemaID: '',
};

export const umpireMenuReducer = (state = initialState, action) => {

  let newState = deepCopy(state);

  switch (action.type) {
    case ActionConstant.SET_SELECTED_SCHEMA:
      newState.selectedSchemaID = action.payload;
      return newState;
      
    default:
      return newState;
  }
};