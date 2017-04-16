const uuid = require('uuid/v4')
const clone = require('clone')
const patcher = require('json-patch')

let todos = []

const getAllTodos = () => todos;

const getTodoById = id => {
  const [foundTodo] = todos.filter(todo => todo.id === id);
  return foundTodo
}

const addTodo = todo => {
  todo.id = uuid()
  todos.push(todo)
}

const patchTodo = ({todo, patch}) => patcher.apply(clone(todo), patch)

const patchTodoById = (id, patch) => {
  let foundTodo = null

  todos = todos.map(todo => {
    if(todo.id === id) {
      todo = patchTodo({todo, patch})
      foundTodo = todo
    }
    return todo
  })

  return foundTodo
}

const deleteTodoById = id =>   todos = todos.filter(todo => todo.id !== id)

module.exports = {
  getAllTodos,
  getTodoById,
  addTodo,
  patchTodoById,
  deleteTodoById,
}