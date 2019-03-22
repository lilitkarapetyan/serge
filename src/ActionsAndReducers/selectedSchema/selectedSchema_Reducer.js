import ActionConstant from '../ActionConstants';

export const selectedSchemaReducer = (state = '', action) => {

  let newState = state;

  switch (action.type) {
    case ActionConstant.SET_SELECTED_SCHEMA:
      newState = action.payload;
      return newState;

    default:
      return newState;
  }
};