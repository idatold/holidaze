import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App component", () => {
  it("renders the Vite + React heading", () => {
    render(<App />);
    expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument();
  });

  it("increments the counter when the button is clicked", () => {
    render(<App />);
    const button = screen.getByRole("button", { name: /count is 0/i });

    // click once
    fireEvent.click(button);
    expect(screen.getByRole("button", { name: /count is 1/i })).toBeInTheDocument();

    // click again
    fireEvent.click(button);
    expect(screen.getByRole("button", { name: /count is 2/i })).toBeInTheDocument();
  });
});
