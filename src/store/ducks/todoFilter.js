import { createActions, handleActions } from 'redux-actions';
import { constructN, tryCatch, ifElse, compose, isEmpty, identity } from 'ramda';

import { pickPayload } from '^/utils';

import { createDefaultTodoFilter } from '^/constants/defaultState';

const SET_TODO_FILTER = 'SET_TODO_FILTER';
const CLEAR_TODO_FILTER = 'CLEAR_TODO_FILTER';

export const { setTodoFilter, clearTodoFilter } = createActions({
  [SET_TODO_FILTER]: compose(tryCatch(constructN(1, RegExp), createDefaultTodoFilter), ifElse(isEmpty, createDefaultTodoFilter, identity))
}, CLEAR_TODO_FILTER);

export default handleActions({
  [setTodoFilter]: pickPayload,
  [clearTodoFilter]: createDefaultTodoFilter,
}, createDefaultTodoFilter());
