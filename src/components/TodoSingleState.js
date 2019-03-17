import React, { Fragment, useState } from 'react'

const Todo = props => {
  const [todoState, setTodoState] = useState({ todo: '', todos: [] })

  const inputChangeHandler = event => {
    setTodoState({ todo: event.target.value, todos: todoState.todos })
  }

  const todoAddHandler = () => {
    setTodoState({
      todo: todoState.todo,
      todos: todoState.todos.concat(todoState.todo)
    })
  }

  return (
    <Fragment>
      <input
        type="text"
        placeholder="Todo"
        onChange={inputChangeHandler}
        value={todoState.todo}
      />
      <button type="button" onClick={todoAddHandler}>
        Add
      </button>
      <ul>
        {todoState.todos.map((todo, index) => {
          return <li key={index}>{todo}</li>
        })}
      </ul>
    </Fragment>
  )
}

export default Todo
