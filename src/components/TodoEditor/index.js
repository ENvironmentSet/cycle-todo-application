import { br, section, input, label } from '@cycle/dom';
import { compose, find, invoker, prop, propEq, curryN, dissoc } from 'ramda';
import xs from 'xstream';

import { updateTodoItem } from '^/store/ducks';

import { ejectElementValueFormEvent, wrap } from '^/utils';

function connector(DOM) {
  const titleInput$ = DOM.select('#todo-title').events('keyup');
  const contentInput$ = DOM.select('#todo-content').events('keyup');
  const tagsInput$ = DOM.select('#todo-tags').events('keyup');
  const statusClick$ = DOM.select('#todo-status').events('click');

  return {
    titleInput$,
    contentInput$,
    tagsInput$,
    statusClick$,
  };
}

function modeler({ state$, props$, titleInput$, contentInput$, tagsInput$, statusClick$ }) {
  const todo$ = props$
    .map(id => state$.map(compose(find(propEq('id', id)), prop('todoList'))))
    .flatten()
    .remember();
  const title$ = titleInput$.map(compose(wrap('title'), ejectElementValueFormEvent)).remember();
  const content$ = contentInput$.map(compose(wrap('content'), ejectElementValueFormEvent)).remember();
  const tags$ = tagsInput$.map(compose(wrap('tags'), invoker(1, 'split')(','), ejectElementValueFormEvent)).remember();
  const status$ = statusClick$.map(compose(wrap('done'), prop('checked'), prop('target'))).remember();

  return {
    todo$,
    title$,
    content$,
    tags$,
    status$,
  }
}

function renderer(todo$) {
  return todo$
    .map(({ title, content, tags, done }) => section('#todo-editor', [
      label({ attrs: { for: 'todo-title' } }, 'title'),
      input('#todo-title', { attrs: { name: 'todo-title', value: title } }),
      br(),
      label({ attrs: { for: 'todo-content' } }, 'content'),
      input('#todo-content', { attrs: { name: 'todo-content', value: content } }),
      br(),
      label({ attrs: { for: 'todo-tags' } }, 'tags'),
      input('#todo-tags', { attrs: { name: 'todo-tags', value: String(tags) } }),
      br(),
      input('#todo-status', { attrs: { type: 'checkbox', checked: done } }),
    ]));
}

function dispatcher({ props$, title$, content$, tags$, status$ }) {
  return props$
    .map(id =>
      xs.merge(title$, content$, tags$, status$).map(curryN(2, updateTodoItem)(id)),
    )
    .flatten();
}

export default function TodoEditor({ DOM, state$, props$ }) {
  const connections = connector(DOM);
  const models = modeler({ ...connections, state$, props$ });
  const vdom$ = renderer(models.todo$);
  const action$ = dispatcher({ ...dissoc('todo$', models), props$ });

  return {
    DOM: vdom$,
    router: xs.never(),
    action$,
  }
}
