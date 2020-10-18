// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import React, { useReducer } from 'react'

const reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return {...state, count: state.count + action.step} 
  
    default:
      return state
  }
}

function Counter({initialCount = 0, step = 1}) {
  // 🐨 replace React.useState with React.useReducer.
  // 💰 React.useReducer(countReducer, initialCount)
  const [state, dispatch] = useReducer(reducer, {count: initialCount})

  // 💰 you can write the countReducer function so you don't have to make any
  // changes to the next two lines of code! Remember:
  // The 1st argument is called "state" - the current value of count
  // The 2nd argument is called "newState" - the value passed to setCount
  const increment = () => dispatch({step, type: 'increment'})
  return <button onClick={increment}>{state.count}</button>
}

function App() {
  return <Counter />
}

export default App
