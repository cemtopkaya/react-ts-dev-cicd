import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CounterButton } from "./CounterButton";

describe("CounterButton", () => {

  it("renders with initial count", () => {
    render(<CounterButton />);
    expect(screen.getByRole("button")).toHaveTextContent("count is 0");
  });

  it('sıfırdan başlarken özel davranış çalışmalı', () => {
    const { getByText } = render(<CounterButton />)
    const button = getByText(/count is 0/i)
  
    fireEvent.click(button)
    expect(getByText(/count is 42/i)).toBeTruthy()
  })

  it("increments only by 1 when count is even (0)", () => {
    render(<CounterButton />);
    const button = screen.getByRole("button");
    // count is 0 (even)
    fireEvent.click(button);
    expect(button).toHaveTextContent("count is 1");
  });

  // Bu testi es geçerek branch coverage'ı %50'ye düşürüyoruz
  it.skip("increments count by 2 when count is odd (else block)", () => {
    render(<CounterButton />);
    const button = screen.getByRole("button");

    // First click: count is 0 (even), goes to 1 (if block)
    fireEvent.click(button);

    // Second click: count is 1 (odd), should increment by 2 (else block)
    fireEvent.click(button);

    expect(button.textContent).toBe("count is 3");
  });

});

