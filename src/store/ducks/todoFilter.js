import { createActions, handleActions } from 'redux-actions';
import { constructN } from 'ramda';

import { createDefaultTodoFilter } from '^/constants/defaultState';

const SET_TODO_FILTER = 'SET_TODO_FILTER';
const CLEAR_TODO_FILTER = 'CLEAR_TODO_FILTER';

export const { setTodoFilter, clearTodoFilter } = createActions({
  [SET_TODO_FILTER]: constructN(1, RegExp),
}, CLEAR_TODO_FILTER);

export default handleActions({
  [setTodoFilter]: (_, { payload: filter }) => filter,
  [clearTodoFilter]: createDefaultTodoFilter,
}, createDefaultTodoFilter());
