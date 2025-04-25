import { useState } from "react";

export function CounterButton() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    if (count === 0) {
      console.log("ilk tıklama (sıfır)");
      setCount(count + 1);
      return;
    } else if (count % 4 === 0) {
      console.log("çift sayi");
      setCount(count + 2);
      return;
    } else {
      console.log("tek sayi");
      setCount(count + 1);
      return;
    }
  };

  return <button onClick={handleClick}>count is {count}</button>;
}
