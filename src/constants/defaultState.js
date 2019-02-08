export const createDefaultTodoList = () => [];
export const createDefaultTodoForm = () => ({ title: '', content: '', tags: [] });
export const createDefaultTodoFilter = () => /.+/;

export default function createDefaultState() {
  return {
    todoList: createDefaultTodoList(),
    todoForm: createDefaultTodoForm(),
    todoFilter: createDefaultTodoFilter(),
  };
}
