import { createStore, combineReducers } from 'redux';
import * as reducers from './reducers/index';

const rootReducer = combineReducers(reducers);
export const store = createStore(rootReducer);
