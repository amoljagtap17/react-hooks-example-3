import React, { Fragment, useState, useEffect } from 'react'
import todoApi from '../apis/todos'

const Todo = props => {
  const [todo, setTodo] = useState('')
  const [submittedTodo, setSubmittedTodo] = useState(null)
  const [todos, setTodos] = useState([])

  const inputChangeHandler = event => {
    setTodo(event.target.value)
  }

  useEffect(() => {
    todoApi.get('/todos.json').then(res => {
      const todoData = res.data
      const todos = []
      for (const key in todoData) {
        todos.push({ id: key, name: todoData[key].name })
      }
      setTodos(todos)
    })

    return () => {
      console.log('clean up')
    }
  }, [])

  useEffect(() => {
    if (submittedTodo) {
      setTodos(todos.concat(submittedTodo))
    }
  }, [submittedTodo])

  const todoAddHandler = () => {
    todoApi
      .post('/todos.json', {
        name: todo
      })
      .then(res => {
        setTimeout(() => {
          const todoItem = { id: res.data.name, name: todo }
          setSubmittedTodo(todoItem)
        }, 3000)
      })
      .catch(err => console.log(err))
  }

  return (
    <Fragment>
      <input
        type="text"
        placeholder="Todo"
        onChange={inputChangeHandler}
        value={todo}
      />
      <button type="button" onClick={todoAddHandler}>
        Add
      </button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </Fragment>
  )
}

export default Todo
