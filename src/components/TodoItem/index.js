import { prop, compose, find, propEq, isNil, not, map, partial } from 'ramda';
import { p, h3, input, li, ul, button, article, header } from '@cycle/dom';
import { updateTodoItem, deleteTodoItem } from '^/store/ducks';
import xs from 'xstream';

function connector(DOM) {
  const status$ = DOM.select('.todo-status').events('click');
  const edit$ = DOM.select('.edit-button').events('click');
  const delete$ = DOM.select('.delete-button').events('click');

  return {
    status$,
    edit$,
    delete$,
  };
}

function modeler({ state$, props$ }) {
  return props$
    .map(
      id => state$.map(compose(find(propEq('id', id)), prop('todoList')))
    )
    .flatten()
    .filter(compose(not, isNil))
    .remember();
}

function renderer(todo$) {
  return todo$
    .map(
      ({ title, content, tags, done}) => article('.todo-item', [
        header('.todo-item-header', [h3('.todo-title', title)]),
        p('.todo-content', content),
        ul('.todo-tags', map(partial(li, ['.todo-tag']), tags)),
        input('.todo-status', { attrs: { type: 'checkbox', checked: done } }),
        button('.edit-button', { attrs: { type: 'button' } }, 'edit this todo item.'),
        button('.delete-button', { attrs: { type: 'button' } }, 'delete this todo item.'),
      ])
    );
}

function router({ edit$, props$ }) {
  return props$
    .map(
      id => edit$.mapTo(`/edit/${id}`)
    )
    .flatten();
}

function dispatcher({ todo$, status$, delete$ }) {
  return todo$
    .map(
      ({ id, done }) => xs.merge(
        status$.mapTo(updateTodoItem(id, { done: not(done) })),
        delete$.mapTo(deleteTodoItem(id))
      )
    )
    .flatten();
}

export default function TodoItem({ DOM, state$, props$ }) {
  const connections = connector(DOM);
  const todo$ = modeler({ state$, props$ });
  const vdom$ = renderer(todo$);
  const path$ = router({ edit$: connections.edit$ , props$ });
  const action$ = dispatcher({ todo$, status$: connections.status$, delete$: connections.delete$ });

  return {
    DOM: vdom$,
    router: path$,
    action$
  };
}
