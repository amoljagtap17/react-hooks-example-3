import React, { Fragment, useEffect, useReducer, useMemo } from 'react'
import todoApi from '../apis/todos'
import List from './List'
import { useFormInput } from '../hooks/forms'

const Todo = () => {
  const todoInput = useFormInput()

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

  const todoAddHandler = () => {
    const todoName = todoInput.value

    todoApi
      .post('/todos.json', {
        name: todoName
      })
      .then(res => {
        setTimeout(() => {
          const todoItem = { id: res.data.name, name: todoName }
          dispatch({ mode: 'ADD', payload: todoItem })
        }, 1000)
      })
      .catch(err => console.log(err))
  }

  const todoRemoveHandler = todoId => {
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
        onChange={todoInput.onChange}
        value={todoInput.value}
        style={{
          backgroundColor: todoInput.validity === true ? 'transparent' : 'red'
        }}
      />
      <button type="button" onClick={todoAddHandler}>
        Add
      </button>
      {useMemo(
        () => (
          <List items={todoList} onClick={todoRemoveHandler} />
        ),
        [todoList]
      )}
    </Fragment>
  )
}

export default Todo
