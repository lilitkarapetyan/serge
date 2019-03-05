import ActionConstant from '../ActionConstants.js';
import {fetch} from 'whatwg-fetch';

const testJsonReceived = (res) => ({
    type: ActionConstant.ASYNC_SUCCESS,
    payload: res
});

const testJsonError = (hasErrored) => ({
  type: ActionConstant.ASYNC_FAILURE,
  hasErrored
});

const testJsonLoading = (loadingState) => ({
  type: ActionConstant.ASYNC_IS_LOADING,
  loadingState
});

export const getTestJson = () => {
  return (dispatch) => {

    dispatch(testJsonLoading(true));

    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        dispatch(testJsonLoading(false));
        return response;
      })
      .then((response) => response.json())
      .then((data) => dispatch(testJsonReceived(data)))
      .catch(() => dispatch(testJsonError(true)));
  }
};