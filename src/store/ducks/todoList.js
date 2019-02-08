import { filter, equals, compose, not, map, cond, identity, T, mergeLeft, prop, construct, propEq } from 'ramda';
import { createActions, handleActions } from 'redux-actions';

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
    [setTodoList]: (_, { payload: todoList }) => todoList,
    [updateTodoItem]: (todoList, { payload: { id, part } }) => map(cond([
      [propEq('id', id), mergeLeft(part)],
      [T, identity]
    ]), todoList),
    [deleteTodoItem]: (todoList, { payload: id }) => filter(compose(not, equals(id), prop('id')), todoList),
    [clearTodoList]: createDefaultTodoList,
    [addTodoItem]: (todoList, { payload: todoItem }) => [...todoList, todoItem],
  },
  createDefaultTodoList()
);
