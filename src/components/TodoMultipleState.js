import React, { Fragment, useState } from 'react'

const Todo = props => {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])

  const inputChangeHandler = event => {
    setTodo(event.target.value)
  }

  const todoAddHandler = () => {
    setTodos(todos.concat(todo))
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
        {todos.map((todo, index) => {
          return <li key={index}>{todo}</li>
        })}
      </ul>
    </Fragment>
  )
}

export default Todo
