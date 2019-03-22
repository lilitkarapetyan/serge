import ActionConstant from '../ActionConstants';

export const selectedSchemaReducer = (state = '', action) => {

  switch (action.type) {
    case ActionConstant.SET_SELECTED_SCHEMA:
      state = action.payload;
      return state;

    default:
      return state;
  }
};