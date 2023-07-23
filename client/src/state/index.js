import {  createStore,applyMiddleware } from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk'
export * as actionCreator from './actionCreator/index';
export const store = createStore(reducer, {state: {isLoggedIn: 'false', userStatus: ''}}, applyMiddleware(thunk));
