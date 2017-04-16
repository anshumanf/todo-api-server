const fetch = require('node-fetch')
const test = require('ava')

const BASE_URL = 'http://localhost:3000'

const localFetch = async (url, method, body = {}) => {
  console.log(`${BASE_URL}${url}`, {
    method,
    headers: ({'Content-Type': 'application/json'}),
    body: JSON.stringify(body)
  })
  let headers
  let resBody
  let status
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: ({'Content-Type': 'application/json'}),
      body: JSON.stringify(body)
    })
    headers = res.headers
    status = res.status
    if(!res.ok) {
      throw Error(res.status)
    }
    resBody = await res.json()
  } catch(e) {
    console.log(e);
  }

  console.log({status, headers, body: resBody})
  return {status, headers, body: resBody}
}

test('api', async t => {
  const {status: initialTodosStatus, headers: initialTodosHeaders, body: initialTodos} = await localFetch(
    `/todos`,
    'GET'
  )
  const initialTodosETag = initialTodosHeaders.get('ETag')
  t.deepEqual(initialTodosStatus, 200)
  t.deepEqual(initialTodos, [])

  const {status: newTodoStatus, headers: newTodoHeaders, body: newTodo} = await localFetch(
    `/todos`,
    'POST',
    {text: 'Sample text'}
  )
  const id = newTodo.id
  const newTodoLocation = newTodoHeaders.get('Location')
  const newTodoETag = newTodoHeaders.get('ETag')
  t.deepEqual(newTodoStatus, 201)
  t.deepEqual(newTodo.text, 'Sample text')
  t.deepEqual(newTodoLocation, `/todos/${id}`)

  const {status: justCreatedStatus, headers: justCreatedTodoHeaders, body: justCreatedTodo} = await localFetch(
    `/todos/${id}`,
    'GET'
  )
  const justCreatedTodoETag = justCreatedTodoHeaders.get('ETag')
  t.deepEqual(justCreatedTodoETag, newTodoETag)
  t.deepEqual(justCreatedStatus, 200)
  t.deepEqual(justCreatedTodo.text, 'Sample text')

  const patchRequestBody = [{op: 'replace', path: '/text', value: 'Newer text'}]

  const {status: patchStatus, headers: patchHeaders, body: patchedTodo} = await localFetch(
    `/todos/${id}`,
    'PATCH',
    patchRequestBody
  )
  const patchETag = patchHeaders.get('ETag')
  t.deepEqual(patchStatus, 200)
  t.deepEqual(patchedTodo.text, 'Newer text')

  const {status: justPatchedStatus, headers: justPatchedHeaders, body: justPatchedTodo} = await localFetch(
    `/todos/${id}`,
    'GET'
  )
  const justPatchedETag = justPatchedHeaders.get('ETag')
  t.deepEqual(justPatchedETag, patchETag)
  t.deepEqual(justPatchedStatus, 200)
  t.deepEqual(justPatchedTodo.text, 'Newer text')

  const {status: deleteStatus} = await localFetch(
    `/todos/${id}`,
    'DELETE'
  )
  t.deepEqual(deleteStatus, 204)

  const {status: reDeleteStatus} = await localFetch(
    `/todos/${id}`,
    'DELETE'
  )
  t.deepEqual(reDeleteStatus, 204)

  const {status: reGetStatus, headers: reGetHeaders} = await localFetch(
    `/todos/${id}`,
    'GET'
  )
  const reGetETag = reGetHeaders.get('ETag')
  t.deepEqual(reGetStatus, 404)
  t.notDeepEqual(reGetETag, patchETag)

  const {status: rePatchStatus, headers: rePatchHeaders} = await localFetch(
    `/todos/${id}`,
    'PATCH',
    patchRequestBody
  )
  const rePatchETag = rePatchHeaders.get('ETag')
  t.notDeepEqual(rePatchETag, patchETag)
  t.deepEqual(rePatchStatus, 404)

  const {status: finalTodosStatus, headers: finalTodosHeaders, body: finalTodos} = await localFetch(
    `/todos`,
    'GET'
  )
  const finalTodosETag = finalTodosHeaders.get('ETag')
  t.deepEqual(finalTodosETag, initialTodosETag)
  t.deepEqual(finalTodosStatus, 200)
  t.deepEqual(finalTodos, [])
})
