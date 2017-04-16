const t = require('tcomb')

const TodoRequest = t.struct({
  text: t.String,
})

const PatchOp = t.enums.of(['replace'])
const PatchPaths = t.enums.of(['/text'])

const TodoPatch = t.struct({
  op: PatchOp,
  path: PatchPaths,
  value: t.String,
})

const TodoPatchRequest = t.list(TodoPatch)

const validateTodoId = id => {
  try {
    t.String(id)
  } catch(e) {
    throw Error(`Invalid input. Expected format:\n${t.String.displayName}`)
  }
}

const validateTodoRequest = todoReq => {
  try {
    TodoRequest(todoReq)
  } catch(e) {
    throw Error(`Invalid input. Expected format:\n${TodoRequest.displayName}`)
  }
}

const validateTodoPatchRequest = todoPatchReq => {
  try {
    TodoPatchRequest(todoPatchReq)
  } catch(e) {
    throw Error(`Invalid input. Expected format:\n${TodoPatchRequest.displayName}`)
  }
}

module.exports = {
  validateTodoId,
  validateTodoRequest,
  validateTodoPatchRequest,
}