import { combineReducers } from 'redux';

import { todoListReducer, todoFormReducer, todoFilterReducer } from '^/store/ducks';

export default combineReducers({ todoList: todoListReducer, todoForm: todoFormReducer, todoFilter: todoFilterReducer })
