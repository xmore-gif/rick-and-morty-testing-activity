import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorPage from "./error";

describe("Error", () => {
  it("muestra el mensaje de error", () => {
    const error = new Error("Test error");
    const reset = vi.fn();

    render(<ErrorPage error={error} reset={reset} />);

    expect(
      screen.getByText("Something went wrong!")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "We couldn't load the characters. Please try again later."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Try again" })
    ).toBeInTheDocument();
  });

  it("ejecuta reset cuando se presiona Try again", () => {
    const error = new Error("Test error");
    const reset = vi.fn();

    render(<ErrorPage error={error} reset={reset} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Try again" })
    );

    expect(reset).toHaveBeenCalledTimes(1);
  });
}); 