import ActionConstant from '../ActionConstants.js';
import { path } from '../../LocationPaths';
import {fetch} from 'whatwg-fetch';

const backendSuccess = (res) => ({
    type: ActionConstant.BACKEND_SUCCESS,
    payload: res
});

const backendError = (hasErrored) => ({
  type: ActionConstant.BACKEND_FAILURE,
  hasErrored
});

const backendIsLoading = (loadingState) => ({
  type: ActionConstant.BACKEND_IS_LOADING,
  loadingState
});

export const getBackendData = () => {
  return (dispatch) => {

    dispatch(backendIsLoading(true));

    fetch(`${path}/home`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        dispatch(backendIsLoading(false));
        return response;
      })
      .then((response) => response.json())
      .then((data) => dispatch(backendSuccess(data)))
      .catch(() => dispatch(backendError(true)));
  }
};