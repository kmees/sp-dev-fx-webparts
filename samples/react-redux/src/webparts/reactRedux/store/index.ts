import { Store, createStore as reduxCreateStore, compose, applyMiddleware } from 'redux';
import createLogger = require('redux-logger');
import thunkMiddleware from 'redux-thunk';

import { rootReducer, IState } from '../reducers';

export { IState } from '../reducers'

export function createStore(initialState?: IState): Store<IState> {
  const loggerMiddleware = createLogger();

  const middlewares = [
    // add additional middleware like redux-thunk here
    thunkMiddleware,
    loggerMiddleware
  ];

  return reduxCreateStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares)
  )) as Store<IState>;
}
