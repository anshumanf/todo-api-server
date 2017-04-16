```
http get localhost:3000/todos
http post localhost:3000/todos text='Sample text'
http get localhost:3000/todos/${id}
echo '[{"op": "replace", "path": "/text", "value": "Newer text"}]'  | http patch localhost:3000/todos/${id}
http get localhost:3000/todos/${id}
http delete localhost:3000/todos/${id}
http delete localhost:3000/todos/${id}
http get localhost:3000/todos/${id}
echo '[{"op": "replace", "path": "/text", "value": "Newer text"}]'  | http patch localhost:3000/todos/${id}
http get localhost:3000/todos
```