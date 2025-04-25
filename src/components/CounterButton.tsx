import { useState } from "react";

export function CounterButton() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    if (count === 0) {
      console.log("ilk tıklama (sıfır)");
      setCount(99);
      return;
    }

    if (count % 2 === 0) {
      console.log("çift sayi");
      setCount(count + 1);
      return;
    }

    console.log("tek sayi");
    setCount(count + 2);
  };

  return <button onClick={handleClick}>count is {count}</button>;
}
