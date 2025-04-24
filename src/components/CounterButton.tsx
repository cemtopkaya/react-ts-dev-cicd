import { useState } from 'react'

export function CounterButton() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => {
      if (count % 2 === 0) {
        setCount(count + 1)
        console.log("çift")
      } else {
        setCount(count + 2)
        console.log("tek")
      }
    }}>
      count is {count}
    </button>
  )
}