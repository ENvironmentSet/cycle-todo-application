import { input } from '@cycle/dom';
import debounce from 'xstream/extra/debounce'
import { prop, compose } from 'ramda';

import { setTodoFilter } from '^/store/ducks';

function connector(DOM) {
  return DOM.select('.todoFilter').events('keyup').compose(debounce(1000));
}

function modeler(state$) {
  return state$.map(prop('todoFilter'));
}

function renderer(todoFilter$) {
  return todoFilter$.map(todoFilter => input('.todoFilter', { attr: { value: todoFilter } }))
}

function dispatcher(change$) {
  return change$.map(compose(setTodoFilter, prop('value'), prop('target')));
}

export default function TodoFilter({ DOM, state$ }) {
  const change$ = connector(DOM);
  const todoFilter$ = modeler(state$);
  const vdom$ = renderer(todoFilter$);
  const action$ = dispatcher(change$);

  return {
    DOM: vdom$,
    action$,
  };
}
