import xs from 'xstream';

import TodoList from '^/components/TodoList';
import TodoEditor from '^/components/TodoEditor';
import TodoForm from '^/components/TodoForm';

export default {
  '/': TodoList,
  '/edit/:id': id => sources => TodoEditor({ ...sources, props$: xs.of(id) }),
  '/form': TodoForm,
};
