import { createActions, handleActions } from 'redux-actions';
import { constructN, tryCatch } from 'ramda';

import { pickPayload } from '^/utils';

import { createDefaultTodoFilter } from '^/constants/defaultState';

const SET_TODO_FILTER = 'SET_TODO_FILTER';
const CLEAR_TODO_FILTER = 'CLEAR_TODO_FILTER';

export const { setTodoFilter, clearTodoFilter } = createActions({
  [SET_TODO_FILTER]: tryCatch(constructN(1, RegExp), createDefaultTodoFilter)
}, CLEAR_TODO_FILTER);

export default handleActions({
  [setTodoFilter]: pickPayload,
  [clearTodoFilter]: createDefaultTodoFilter,
}, createDefaultTodoFilter());
