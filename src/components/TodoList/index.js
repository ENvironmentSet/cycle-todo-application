import { prop, map, pipe, cond, T, compose, partial, equals, always, filter, find, values, flatten, test, dissoc } from 'ramda';
import { ul, li, section, button } from '@cycle/dom';
import xs from 'xstream';
import isolate from '@cycle/isolate';

import { clearTodoList } from '^/store/ducks';

import TodoItem from '^/components/TodoItem';
import TodoFilter from '^/components/TodoFilter';

import { createDefaultTodoList } from '^/constants';

function connector(DOM) {
  const clear$ = DOM.select('.clear-button').events('click');
  const create$ = DOM.select('.create-button').events('click');

  return {
    clear$,
    create$,
  };
}

function modeler(state$) {
  return { //@TODO: optimize here
    todoList$: state$.map(prop('todoList')),
    todoFilter$: state$.map(prop('todoFilter')),
  };
}

function childrenCombiner({ todoList$, todoFilter$, sources }) {
  const childrenSinks$ = todoFilter$
    .map(todoFilter => todoList$
      .map(
        pipe(
          filter(compose(find(test(todoFilter)), flatten, values, dissoc('id'))),
          map(todoItem => {
            const id = todoItem.id;
            const props$ = xs.of(id);
            const isolatedTodoItem = isolate(TodoItem, id);

            return isolatedTodoItem({ ...sources, props$ });
          }),
          cond([
            [compose(equals(0), prop('length')), always({ DOM: xs.of(createDefaultTodoList()), router: xs.never(), action$: xs.never() })],
            [T, todoItemSinks => ({
              DOM: xs.combine(...map(prop('DOM'), todoItemSinks)),
              router: xs.merge(...map(prop('router'), todoItemSinks)),
              action$: xs.merge(...map(prop('action$'), todoItemSinks)),
            })]
          ]),
        )
      )
    )
    .flatten()
    .remember();

  return {
    DOM: childrenSinks$.map(prop('DOM')).flatten().remember(),
    router: childrenSinks$.map(prop('router')).flatten(),
    action$: childrenSinks$.map(prop('action$')).flatten(),
  }
}

function renderer({ todoItems$, todoFilter$ }) {
  return todoFilter$
    .map(todoFilter => todoItems$
      .map(compose(partial(ul,['.todo-list']), map(compose(partial(li, ['.todo-item-element']), Array))))
      .map(todoList => section('.todo-main', [
        todoFilter,
        button('.clear-button', { attrs: { type: 'button' } }, 'clear all todo item'),
        todoList,
        button('.create-button', { attrs: { type: 'button' } }, 'create your own todo item!')
      ]))
    )
    .flatten()
    .remember();
}

function router(create$) {
  return create$.mapTo('/form');
}

function dispatcher(clear$) {
  return clear$.map(clearTodoList);
}

export default function TodoList({ DOM, state$ }) {
  const connections = connector(DOM);
  const model = modeler(state$);
  const todoFilterSinks = TodoFilter({ DOM, state$ });
  const todoItemSinks = childrenCombiner({ todoList$: model.todoList$, todoFilter$: model.todoFilter$, sources: { DOM, state$ } });
  const vdom$ = renderer({ todoItems$: todoItemSinks.DOM, todoFilter$: todoFilterSinks.DOM });
  const path$ = router(connections.create$);
  const action$ = dispatcher(connections.clear$);

  return {
    DOM: vdom$,
    router: xs.merge(path$, todoItemSinks.router),
    action$: xs.merge(action$, todoItemSinks.action$, todoFilterSinks.action$),
  };
}
