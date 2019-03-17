import React, { Fragment, useState, useEffect, useReducer } from 'react'
import todoApi from '../apis/todos'

const Todo = props => {
  const [todo, setTodo] = useState('')
  // const [submittedTodo, setSubmittedTodo] = useState(null)
  // const [todos, setTodos] = useState([])

  const todoListReducer = (state, action) => {
    switch (action.mode) {
      case 'ADD':
        return state.concat(action.payload)
      case 'SET':
        return action.payload
      case 'REMOVE':
        return state.filter(todo => todo.id !== action.payload)
      default:
        return state
    }
  }

  // const [state, dispatch] = useReducer(todoListReducer, [])
  const [todoList, dispatch] = useReducer(todoListReducer, [])

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
      dispatch({ mode: 'SET', payload: todos })
    })

    return () => {
      console.log('clean up')
    }
  }, [])

  /* useEffect(() => {
    if (submittedTodo) {
      dispatch({ mode: 'ADD', payload: submittedTodo })
    }
  }, [submittedTodo]) */

  const todoAddHandler = () => {
    todoApi
      .post('/todos.json', {
        name: todo
      })
      .then(res => {
        setTimeout(() => {
          const todoItem = { id: res.data.name, name: todo }
          // setSubmittedTodo(todoItem)
          dispatch({ mode: 'ADD', payload: todoItem })
        }, 3000)
      })
      .catch(err => console.log(err))
  }

  const todoRemove = todoId => {
    todoApi
      .delete(`/todos/${todoId}.json`)
      .then(() => {
        dispatch({ mode: 'REMOVE', payload: todoId })
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
        {todoList.map(todo => (
          <li key={todo.id} onClick={todoRemove.bind(this, todo.id)}>
            {todo.name}
          </li>
        ))}
      </ul>
    </Fragment>
  )
}

export default Todo
