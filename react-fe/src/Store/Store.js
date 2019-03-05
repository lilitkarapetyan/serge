import { applyMiddleware, combineReducers, createStore } from 'redux';
import logger from 'redux-logger';
import { updateName } from '../ActionsAndReducers/Username/Username_Reducer';
import { asyncReducers } from '../ActionsAndReducers/TestAsync/Async_Reducer';
import { backendReducers } from '../ActionsAndReducers/TestBackend/Backend_Reducer';
import thunk from 'redux-thunk';

export const Store = createStore(combineReducers({
  updateName,
  ...asyncReducers,
  ...backendReducers,
}), applyMiddleware(logger, thunk));