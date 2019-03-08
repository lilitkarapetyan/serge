import ActionConstant from '../ActionConstants';

var initialState = {
  isLoading: false,
  hasErrored: false,
  payload: null
};

export const asyncReducer = (state = initialState, action) => {

    switch (action.type) {

      case ActionConstant.ASYNC_LOADING:
        state.isLoading = action.isLoading;
        return state;

      case ActionConstant.ASYNC_FAIL:
        state.hasErrored = action.error ? true : false;
        return state;

      case ActionConstant.ASYNC_SUCCESS:
        state.payload = action.payload;
        return state;

      default:
        return state;
    }
};