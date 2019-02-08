import { createActions, handleActions } from 'redux-actions';

import { createDefaultTodoForm } from '^/constants';

const SET_TODO_FORM_TITLE = 'SET_TODO_FORM_TITLE';
const SET_TODO_FORM_CONTENT = 'SET_TODO_FORM_CONTENT';
const SET_TODO_FORM_TAGS = 'SET_TODO_FORM_TAGS';
const RESET_TODO_FORM = 'RESET_TODO_FORM';
const SET_TODO_FORM = 'SET_TODO_FORM';

export const {
  setTodoFormTitle,
  setTodoFormContent,
  setTodoFormTags,
  resetTodoForm
} = createActions({
  [RESET_TODO_FORM]: () => {},
}, SET_TODO_FORM_TITLE, SET_TODO_FORM_CONTENT, SET_TODO_FORM_TAGS, SET_TODO_FORM);

export default handleActions(
  {
    [setTodoFormTitle]: (todoForm, { payload: title }) => ({ ...todoForm, title }),
    [setTodoFormContent]: (todoForm, { payload: content }) => ({ ...todoForm, content }),
    [setTodoFormTags]: (todoForm, { payload: tags }) => ({ ...todoForm, tags }),
    [resetTodoForm]: createDefaultTodoForm,
    [SET_TODO_FORM]: (_, { payload: todoForm }) => todoForm,
  },
  createDefaultTodoForm()
);
