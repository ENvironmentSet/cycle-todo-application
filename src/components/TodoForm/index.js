import { prop, compose, invoker } from 'ramda';
import xs from 'xstream';
import { form, label, input, button, br } from '@cycle/dom';

import { setTodoFormTitle, setTodoFormContent, setTodoFormTags, resetTodoForm, addTodoItem } from '^/store/ducks';

import { ejectElementValueFormEvent } from '^/utils';

function connector(DOM) {
  const titleInput$ = DOM.select('.todo-title').events('keyup');
  const contentInput$ = DOM.select('.todo-content').events('keyup');
  const tagsInput$ = DOM.select('.todo-tags').events('keyup');
  const create$ = DOM.select('.todo-submit').events('click');

  return {
    titleInput$,
    contentInput$,
    tagsInput$,
    create$,
  };
}

function modeler({ titleInput$, contentInput$, tagsInput$, state$ }) {
  const todoForm$ = state$.map(prop('todoForm'));
  const title$ = titleInput$.map(ejectElementValueFormEvent).remember();
  const content$ = contentInput$.map(ejectElementValueFormEvent).remember();
  const tags$ = tagsInput$.map(compose(invoker(1, 'split')(','), ejectElementValueFormEvent)).remember();

  return {
    todoForm$,
    title$,
    content$,
    tags$,
  }
}

function renderer(todoForm$) {
  return todoForm$
    .map(({ title, content, tags }) => form('.todo-form', [
      label({ attrs: { for: 'todo-title' } }, 'title:'),
      input('.todo-title', { attrs: { name: 'todo-title', value: title } }),
      br(),
      label({ attrs: { for: 'todo-content' } }, 'content:'),
      input('.todo-content', { attrs: { name: 'todo-content', value: content } }),
      br(),
      label({ attrs: { for: 'todo-tags' } }, 'tags:'),
      input('.todo-tags', { attrs: { name: 'todo-tags', value: String(tags) } }),
      br(),
      button('.todo-submit', { attrs: { type: 'button' } }, 'create todo item!'),
    ]))
}

function router(create$) {
  return create$.mapTo('/');
}

function dispatcher({ title$, content$, tags$, todoForm$, create$ }) {
  const titleAction$ = title$.map(setTodoFormTitle);
  const contentAction$ = content$.map(setTodoFormContent);
  const tagsAction$ = tags$.map(setTodoFormTags);
  const createTodoAction$ = todoForm$.map(({ title, content, tags }) => create$.mapTo(
      xs.of(addTodoItem(title, content, tags), resetTodoForm()),
    ).flatten(),
  ).flatten();

  return xs.merge(titleAction$, contentAction$, tagsAction$, createTodoAction$);
}

export default function TodoForm({ DOM, state$ }) {
  const connections = connector(DOM);
  const model = modeler({ ...connections, state$ });
  const vdom$ = renderer(model.todoForm$);
  const path$ = router(connections.create$);
  const action$ = dispatcher({ ...model, create$: connections.create$ });

  return {
    DOM: vdom$,
    router: path$,
    action$,
  }
}
