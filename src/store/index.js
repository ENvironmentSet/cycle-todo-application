import { createStore, applyMiddleware } from 'redux';
import { createDefaultState } from '^/constants';
import { storeDeserializer } from '^/utils';

import { createCycleMiddleware } from '^/drivers';

import rootReducer from '^/store/rootReducer';

const cycleMiddleware = createCycleMiddleware();
const middlewares = applyMiddleware(cycleMiddleware);
const persistedState = localStorage.getItem('persisted_state');
const preloadedState = persistedState ? storeDeserializer(persistedState) : createDefaultState();
const store = createStore(rootReducer, preloadedState, middlewares);

export default store;
export const { actionDriver, stateDriver } = cycleMiddleware;
