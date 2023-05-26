'use client';
import {createContext, useContext, useEffect, useReducer} from 'react';
import {ApiPromise, WsProvider} from '@polkadot/api';
import config from '../config';
import {keyring, Keyring} from '@polkadot/ui-keyring';
import {cryptoWaitReady} from '@polkadot/util-crypto';

const connectedSocket = config.PROVIDER_SOCKET;
const initialReducer = {
  api: null,
  apiStatus: 'new',
  socket: connectedSocket,
  keyring: new Keyring(),
  profileAddress: null,
};

const SubstrateContext = createContext(initialReducer as any);
const SubstrateReducerDispatchContext = createContext(null as any);

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
    _api.isReady.then(_api => {
      cryptoWaitReady().then(() => {
        // load all available addresses and accounts
        keyring.loadAll({ss58Format: 42, type: 'sr25519'});
        dispatch({type: 'connect', api: _api, keyring: keyring});
        // additional initialization here, including rendering
      });
    });
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
  }, [state]);

  console.log('state', state);
  return (
      <SubstrateContext.Provider value={{...state}}>
        <SubstrateReducerDispatchContext.Provider value={dispatch}>
          {props.children}
        </SubstrateReducerDispatchContext.Provider>
      </SubstrateContext.Provider>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'connect': {
      return {
        ...state,
        api: action.api,
        keyring: action.keyring,
        status: 'connection',
      };
    }
    case 'saveAddress': {
      return {
        ...state,
        profileAddress: action.profileAddress,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export const useSubstrate = () => useContext(SubstrateContext);
export const useSubstrateDispatch = () => useContext(
    SubstrateReducerDispatchContext);