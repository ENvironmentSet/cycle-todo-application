import { createActions, handleActions } from 'redux-actions';
import { pickPayload, mergePayloadWithPrev } from '^/utils';

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
  resetTodoForm,
  setTodoForm,
} = createActions({
  [RESET_TODO_FORM]: () => {},
}, SET_TODO_FORM_TITLE, SET_TODO_FORM_CONTENT, SET_TODO_FORM_TAGS, SET_TODO_FORM);

export default handleActions(
  {
    [setTodoFormTitle]: mergePayloadWithPrev('title'),
    [setTodoFormContent]: mergePayloadWithPrev('content'),
    [setTodoFormTags]: mergePayloadWithPrev('tags'),
    [resetTodoForm]: createDefaultTodoForm,
    [setTodoForm]: pickPayload,
  },
  createDefaultTodoForm()
);
