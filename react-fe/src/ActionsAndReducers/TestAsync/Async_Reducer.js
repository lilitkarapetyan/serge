import ActionConstant from '../ActionConstants.js';

export const asyncReducers = {
  testJsonLoading: (state = false, action) => {
    switch (action.type) {
      case ActionConstant.ASYNC_FAILURE:
        return state = action.loadingState;
      default:
        return state;
    }
  },
  testJsonError: (state = false, action) => {
    switch (action.type) {
      case ActionConstant.ASYNC_FAILURE:
        return state = action.hasErrored;
      default:
        return state;
    }
  },
  testJsonReceived: (state = {}, action) => {
    switch (action.type) {
      case ActionConstant.ASYNC_SUCCESS:
        return state = action.payload;
      default:
        return state;
    }
  }
};