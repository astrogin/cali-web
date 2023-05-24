'use client'
import {createContext, useContext, useEffect, useReducer} from 'react';
import {ApiPromise, WsProvider} from '@polkadot/api';
import config from '../config';

const connectedSocket = config.PROVIDER_SOCKET;
const initialReducer = {api: null, apiStatus: 'new', socket: connectedSocket};

const SubstrateContext = createContext(initialReducer);

const connect = (state, dispatch) => {
  const {api, socket} = state;
  // We only want this function to be performed once
  if (api) return;

  //dispatch({type: 'CONNECT_INIT'});

  console.log(`Connected socket: ${socket}`);
  const provider = new WsProvider(socket);
  const _api = new ApiPromise({provider});

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    //dispatch({type: 'connect', api: _api});
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then(_api => dispatch({type: 'connect', api: _api}));
  });
  /*_api.on('ready', () => dispatch({type: 'CONNECT_SUCCESS'}));
  _api.on('error', err => dispatch({type: 'CONNECT_ERROR', payload: err}));*/
};

export function SubstrateProvider(props) {
  const [state, dispatch] = useReducer(
      reducer,
      initialReducer,
  );
  useEffect(() => {
    connect(state, dispatch);
  }, [state])
  console.log('state', state);
  return (
      <SubstrateContext.Provider value={{...state}}>
        {props.children}
      </SubstrateContext.Provider>
  );
}

function reducer(state, action) {
  console.log('action', action);
  switch (action.type) {
    case 'connect': {
      return {
        ...state,
        api: action.api,
        status: 'connection',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
export const useSubstrate = () => useContext(SubstrateContext);