import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CounterButton } from "./CounterButton";

describe("CounterButton", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("initially renders with count 0", () => {
    render(<CounterButton />);
    expect(screen.getByRole("button")).toHaveTextContent("count is 0");
  });

  it("logs and increments by 1 on first click (count 0)", () => {
    render(<CounterButton />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(button).toHaveTextContent("count is 1");
    expect(consoleSpy).toHaveBeenCalledWith("ilk tıklama (sıfır)");
  });

  it("logs and increments by 2 when count is even (not 0)", () => {
    render(<CounterButton />);
    const button = screen.getByRole("button");
    fireEvent.click(button); // 0 -> 1
    fireEvent.click(button); // 1 -> 2
    fireEvent.click(button); // 2 -> 4
    expect(button).toHaveTextContent("count is 4");
    expect(consoleSpy).toHaveBeenCalledWith("çift sayi");
  });

  it("logs and increments by 1 when count is odd (not 0)", () => {
    render(<CounterButton />);
    const button = screen.getByRole("button");
    fireEvent.click(button); // 0 -> 1
    fireEvent.click(button); // 1 -> 2
    fireEvent.click(button); // 2 -> 4
    fireEvent.click(button); // 4 -> 6
    fireEvent.click(button); // 6 -> 7 (odd)
    expect(button).toHaveTextContent("count is 7");
    expect(consoleSpy).toHaveBeenCalledWith("tek sayi");
  });

  it("handles multiple clicks correctly", () => {
    render(<CounterButton />);
    const button = screen.getByRole("button");
    fireEvent.click(button); // 0 -> 1
    fireEvent.click(button); // 1 -> 2
    fireEvent.click(button); // 2 -> 4
    fireEvent.click(button); // 4 -> 6
    fireEvent.click(button); // 6 -> 8
    fireEvent.click(button); // 8 -> 10
    expect(button).toHaveTextContent("count is 10");
    expect(consoleSpy).toHaveBeenCalledTimes(6);
  });

  it("does not log unexpected messages", () => {
    render(<CounterButton />);
    const button = screen.getByRole("button");
    fireEvent.click(button); // 0 -> 1
    fireEvent.click(button); // 1 -> 2
    fireEvent.click(button); // 2 -> 4
    expect(consoleSpy).not.toHaveBeenCalledWith("unexpected log");
  });
});
