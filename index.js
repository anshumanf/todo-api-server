const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const {
  TodoId,
  CreateTodoRequest,
  PatchTodoRequest,
  validate,
} = require('./validation')

const {
  getAllTodos,
  getTodoById,
  addTodo,
  patchTodoById,
  deleteTodoById,
} = require('./model.js')

const PORT = 3000

const app = express()

app.use(cors({exposedHeaders: ['Location', 'ETag']}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const logRequest = req => console.log(`${req.method}: ${req.path}`)

app.use('/', (req, res, next) => {
  logRequest(req)
  if(![undefined, 'application/json'].includes(req.headers['content-type'])) {
    res.status(400)
    res.json('Request body should be application/json')
  } else {
    next();
  }
})

app.get('/todos', (req, res) => {
  res.json(getAllTodos())
})

app.get('/todos/:id', (req, res) => {
  let status = true;
  const id = req.params.id
  let todo = null

  try {
    validate(TodoId)(id)
  }
  catch(e) {
    status = false
    res.status(400)
    res.json(e)
  }

  const foundTodo = getTodoById(id)

  if(foundTodo === undefined) {
    status = false
    res.status(404)
    res.json()
  } else {
    todo = foundTodo
  }

  if(status) {
    res.json(todo)
  }
})

app.post('/todos', (req, res) => {
  let status = true;

  let todo = req.body;

  try {
    validate(CreateTodoRequest)(todo)
  }
  catch(e) {
    status = false
    res.status(400)
    res.json(e)
  }

  if(status) {
    addTodo(todo)
    res.status(201)
    res.location(`/todos/${todo.id}`)
    res.json(todo)
  }
})

app.patch('/todos/:id', (req, res) => {
  let status = true;
  const
    id = req.params.id,
    patch = req.body
  let todo = null

  try {
    validate(TodoId)(id)
    validate(PatchTodoRequest)(patch)
  } catch(e) {
    status = false
    res.status(400)
    res.json(e)
  }

  foundTodo = patchTodoById(id, patch)

  if(foundTodo === null) {
    status = false
    res.status(404)
    res.json()
  } else {
    todo = foundTodo
  }

  if(status) {
    res.location(`/todos/${todo.id}`)
    res.json(todo)
  }
})

app.delete('/todos/:id', (req, res) => {

  let status = true
  const id = req.params.id;

  try {
    validate(TodoId)(id)
  }
  catch(e) {
    status = false
    res.status(400)
    res.json(e)
  }

  deleteTodoById(id)

  res.status(204)
  res.send()
})

app.use('/', (req, res) => {
  res.status(404)
  res.json()
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
