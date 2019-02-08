import { createStore, applyMiddleware } from 'redux';
import { ifElse, isNil, not, compose } from 'ramda';
import { createDefaultState } from '^/constants';
import { storeDeserializer } from '^/utils';

import { createCycleMiddleware } from '^/drivers';

import rootReducer from '^/store/rootReducer';

const cycleMiddleware = createCycleMiddleware();
const middlewares = applyMiddleware(cycleMiddleware);
const preloadedState = ifElse(
  compose(not, isNil),
  storeDeserializer,
  createDefaultState
)(localStorage.getItem('persisted_state'));
const store = createStore(rootReducer, preloadedState, middlewares);

export default store;
export const { actionDriver, stateDriver } = cycleMiddleware;
