import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CounterButton } from "./CounterButton";

describe("CounterButton", () => {
  it("initially renders with count 0", () => {
    render(<CounterButton />);
    expect(screen.getByRole("button")).toHaveTextContent("count is 0");
  });

  it("sets count to 42 when initial count is 0", () => {
    render(<CounterButton />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(button).toHaveTextContent("count is 42");
  });

  it("increments by 1 when count is even (not 0)", () => {
    render(<CounterButton />);
    const button = screen.getByRole("button");
    
    // İlk tıklama: 0 → 42
    fireEvent.click(button);
    // Manuel olarak sayacı 2 yapalım
    fireEvent.click(button); // 42 → 43
    fireEvent.click(button); // 43 → 45
    // Şimdi 45 → 47 olacak (tek sayı testi)
    fireEvent.click(button);
    expect(button).toHaveTextContent("count is 47");
  });
});
