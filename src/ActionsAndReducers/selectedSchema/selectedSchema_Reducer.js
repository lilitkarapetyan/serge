import ActionConstant from '../ActionConstants';

export const selectedSchemaReducer = (state = '', action) => {

  let newState = state;

  switch (action.type) {
    case ActionConstant.SET_SELECTED_SCHEMA:
      console.log(action.payload);
      newState = action.payload;
      return newState;

    default:
      return newState;
  }
};