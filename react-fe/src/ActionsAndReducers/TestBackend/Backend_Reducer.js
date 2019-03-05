import ActionConstant from '../ActionConstants.js';

export const backendReducers = {
  backendDataLoading: (state = false, action) => {
    switch (action.type) {
      case ActionConstant.BACKEND_IS_LOADING:
        return state = action.loadingState;
      default:
        return state;
    }
  },
  backendDataFailure: (state = false, action) => {
    switch (action.type) {
      case ActionConstant.BACKEND_FAILURE:
        return state = action.hasErrored;
      default:
        return state;
    }
  },
  backendDataReceived: (state = {}, action) => {
    switch (action.type) {
      case ActionConstant.BACKEND_SUCCESS:
        return state = action.payload;
      default:
        return state;
    }
  }
};