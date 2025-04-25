import { useState } from 'react'

export function CounterButton() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => {
      if (count === 0) {
        setCount(42) // sıfırsa özel bir değer
        console.log("ilk tıklama")
      } else if (count % 2 === 0) {
        setCount(count + 1)
        console.log("çift sayi")
      } else {
        setCount(count + 2)
        console.log("tek sayi")
      }
    }}>
      count is {count}
    </button>
  )
}
