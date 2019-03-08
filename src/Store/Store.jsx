import { applyMiddleware, combineReducers, createStore } from 'redux';
import { updateName } from '../ActionsAndReducers/TestNormal/Example_Reducer';
import { asyncReducer } from '../ActionsAndReducers/ExampleAsync/Async_Reducer';
import thunk from 'redux-thunk';

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);
  middlewares.push(logger);
}


export default createStore(combineReducers({
  username: updateName,
  data: asyncReducer,
}), applyMiddleware(...middlewares));