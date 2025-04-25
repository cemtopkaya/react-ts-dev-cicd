import { useState } from 'react'

export function CounterButton() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => {
      if (count % 2 === 0) {
        setCount(count + 1)
        console.log("çift sayi")
        console.log("çift sayi 1")
      } else {
        setCount(count + 2)
        console.log("tek sayi")
        console.log("tek sayi 1")
      }
    }}>
      count is {count}
    </button>
  )
}