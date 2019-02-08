import { prop, compose, invoker } from 'ramda';
import xs from 'xstream';
import { form, label, input, button, br } from '@cycle/dom';

import { setTodoFormTitle, setTodoFormContent, setTodoFormTags, resetTodoForm, addTodoItem } from '^/store/ducks';

import { ejectElementValueFormEvent } from '^/utils';

function connector(DOM) {
  const titleInput$ = DOM.select('.todoTitle').events('keyup');
  const contentInput$ = DOM.select('.todoContent').events('keyup');
  const tagsInput$ = DOM.select('.todoTags').events('keyup');
  const create$ = DOM.select('.todoSubmit').events('click');

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
    .map(({ title, content, tags }) => form('.todoForm', [
      label({ attrs: { for: 'todoTitle' } }, 'title:'),
      input('.todoTitle', { attrs: { name: 'todoTitle', value: title } }),
      br(),
      label({ attrs: { for: 'todoContent' } }, 'content:'),
      input('.todoContent', { attrs: { name: 'todoContent', value: content } }),
      br(),
      label({ attrs: { for: 'todoTags' } }, 'tags:'),
      input('.todoTags', { attrs: { name: 'todoTags', value: String(tags) } }),
      br(),
      button('.todoSubmit', { attrs: { type: 'button' } }, 'create todo item!'),
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
