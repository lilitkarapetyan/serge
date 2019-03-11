import ActionConstant from '../ActionConstants';

var initialState = {
  isLoading: false,
  savedSuccessfully: false,
  errorMessage: ''
};

export const createMessageReducer = (state = initialState, action) => {

    switch (action.type) {

      case ActionConstant.DB_MESSAGE_CREATION_LOADING:
        state.isLoading = action.isLoading;
        return state;

      case ActionConstant.DB_MESSAGE_STATUS:
        state.savedSuccessfully = action.payload.ok ? true : false;
        state.errorMessage = action.payload.error ? action.payload.message : null;
        return state;

      default:
        return state;
    }
};