const t = require('tcomb')

const TodoId = t.String;

const CreateTodoRequest = t.struct({
  text: t.String,
})

const PatchOp = t.enums.of(['replace'])
const PatchPath = t.enums.of(['/text'])

const PatchTodoInstruction = t.struct({
  op: PatchOp,
  path: PatchPath,
  value: t.String,
})

const PatchTodoRequest = t.list(PatchTodoInstruction)

const validate = type => input => {
  try {
    type(input)
  } catch(e) {
    throw Error(`Invalid input. Expected format:\n${type.displayName}`)
  }
}

module.exports = {
  TodoId,
  CreateTodoRequest,
  PatchTodoRequest,
  validate,
}