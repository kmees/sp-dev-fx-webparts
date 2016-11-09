import { EnvironmentType } from '@microsoft/sp-client-base';
import { IWebPartContext } from '@microsoft/sp-client-preview';
import { assign } from 'lodash';

export interface IAsyncState {
  endpoint?: string;
  result?: any;
  loaded: boolean;
  error?: any;
}

export type FetchEndpointStartAction = {
  type: 'user/FETCH_ENDPOINT_START';
  endpoint: string;
}
export type FetchEndpointSuccessAction = {
  type: 'user/FETCH_ENDPOINT_SUCCESS'
  result: any
}
export type FetchEndpointFailAction = {
  type: 'user/FETCH_ENDPOINT_FAIL'
  error: any
}
export type FetchEndpointAction = FetchEndpointStartAction | FetchEndpointSuccessAction | FetchEndpointFailAction
export type AsyncAction = FetchEndpointAction

export const initialState: IAsyncState = {
  loaded: false
};

export default (state = initialState, action: AsyncAction): IAsyncState => {
  switch (action.type) {
    case 'user/FETCH_ENDPOINT_START':
      return assign<{}, IAsyncState>({}, initialState, {
        endpoint: action.endpoint
      });
    case 'user/FETCH_ENDPOINT_SUCCESS':
      return assign<{}, IAsyncState>({}, state, {
        result: action.result,
        loaded: true,
        error: null,
      });
    case 'user/FETCH_ENDPOINT_FAIL':
      return assign<{}, IAsyncState>({}, state, {
        result: null,
        loaded: true,
        error: action.error
      });
    default:
      return state;
  }
};

export function fetchEndpoint(endpoint: string, context: IWebPartContext) {
  return dispatch => {
    dispatch({ type: 'user/FETCH_ENDPOINT_START', endpoint });

    if (context.environment.type === EnvironmentType.Local) {
      const result = {
        title: 'Mock Data',
      };
      dispatch({ type: 'user/FETCH_ENDPOINT_SUCCESS', result });
    } else {
      const url = `${context.pageContext.web.absoluteUrl}/_api/web/${endpoint}`;

      context.httpClient.get(url).then(response => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response.json());
        } else {
          return Promise.reject(new Error(JSON.stringify(response)));
        }
      }).then(json => {
        dispatch({ type: 'user/FETCH_ENDPOINT_SUCCESS', result: json });
      }).catch(err => {
        dispatch({ type: 'user/FETCH_ENDPOINT_FAIL', error: err });
      });
    }
  };
}
