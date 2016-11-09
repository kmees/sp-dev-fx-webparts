import { combineReducers, Reducer } from 'redux';

import webpartReducer, { IWebpartState } from './webpart';
import asyncReducer, { IAsyncState } from './async';

export interface IState {
  webpart: IWebpartState;
  async: IAsyncState;
}

export const rootReducer: Reducer<IState> = combineReducers<IState>({
  webpart: webpartReducer,
  async: asyncReducer
});
