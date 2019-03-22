import ActionConstant from '../ActionConstants';

export const curOpenMessageReducer = (state = '', action) => {

  switch (action.type) {
    case ActionConstant.CURRENT_OPEN_MESSAGE:
      state = action.payload;
      return state;

    default:
      return state;
  }
};