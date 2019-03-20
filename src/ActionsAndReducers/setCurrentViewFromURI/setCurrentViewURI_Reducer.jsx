import ActionConstant from '../ActionConstants';

export const setCurrentViewURIReducer = (state = '/', action) => {

  switch (action.type) {
    case ActionConstant.SET_CURRENT_VIEW_FROM_URI:
      state = action.payload;
      return state;

    default:
      return state;
  }
};