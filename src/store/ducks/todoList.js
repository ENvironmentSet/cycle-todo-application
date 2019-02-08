import { filter, equals, compose, not, map, ifElse, identity, mergeLeft, prop, construct, propEq, pipe, has, apply, flip, append } from 'ramda';
import { createActions, handleActions } from 'redux-actions';
import { pickPayload } from '^/utils';

import { createDefaultTodoList, Todo } from '^/constants';

const SET_TODO_LIST = 'SET_TODO_LIST';
const ADD_TODO_ITEM = 'ADD_TODO_ITEM';
const UPDATE_TODO_ITEM = 'UPDATE_TODO_ITEM';
const DELETE_TODO_ITEM = 'DELETE_TODO_ITEM';
const CLEAR_TODO_LIST = 'CLEAR_TODO_LIST';

export const { setTodoList, updateTodoItem, deleteTodoItem, clearTodoList, addTodoItem } = createActions({
  [UPDATE_TODO_ITEM]: (id, part) => ({ id, part }),
  [ADD_TODO_ITEM]: construct(Todo),
}, SET_TODO_LIST, DELETE_TODO_ITEM, CLEAR_TODO_LIST);

export default handleActions(
  {
    [setTodoList]: pickPayload,
    [updateTodoItem]: (todoList, { payload: { id, part } }) => map(ifElse(propEq('id', id), mergeLeft(part), identity), todoList),
    [deleteTodoItem]: (todoList, { payload: id }) => filter(compose(not, equals(id), prop('id')), todoList),
    [clearTodoList]: createDefaultTodoList,
    [addTodoItem]: pipe(
      Array,
      map(ifElse(has('type'), prop('payload'), identity)),
      apply(flip(append)),
    ),
  },
  createDefaultTodoList()
);
