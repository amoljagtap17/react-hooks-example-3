import React, {
  Fragment,
  useState,
  useEffect,
  useReducer,
  useRef,
  useMemo
} from 'react'
import todoApi from '../apis/todos'
import List from './List'

const Todo = props => {
  // const [todo, setTodo] = useState('')
  // const [submittedTodo, setSubmittedTodo] = useState(null)
  // const [todos, setTodos] = useState([])

  const [inputIsValid, setInputIsValid] = useState(false)

  const todoInputRef = useRef()

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

  /* useEffect(() => {
    if (submittedTodo) {
      dispatch({ mode: 'ADD', payload: submittedTodo })
    }
  }, [submittedTodo]) */

  const todoAddHandler = () => {
    const todoName = todoInputRef.current.value

    todoApi
      .post('/todos.json', {
        name: todoName
      })
      .then(res => {
        setTimeout(() => {
          const todoItem = { id: res.data.name, name: todoName }
          // setSubmittedTodo(todoItem)
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

  const inputValidationHandler = event => {
    if (event.target.value.trim() === '') {
      setInputIsValid(false)
    } else {
      setInputIsValid(true)
    }
  }

  return (
    <Fragment>
      <input
        type="text"
        placeholder="Todo"
        ref={todoInputRef}
        onChange={inputValidationHandler}
        style={{ backgroundColor: inputIsValid ? 'transparent' : 'red' }}
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
