import ActionConstant from '../ActionConstants';
import 'whatwg-fetch';

const testJsonReceived = (res) => ({
    type: ActionConstant.ASYNC_SUCCESS,
    payload: res
});

const testJsonError = (hasErrored) => ({
  type: ActionConstant.ASYNC_FAIL,
  hasErrored
});

const testJsonLoading = (isLoading) => ({
  type: ActionConstant.ASYNC_LOADING,
  isLoading
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