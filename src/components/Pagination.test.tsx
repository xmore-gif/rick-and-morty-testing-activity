import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination", () => {
  it("muestra la primera página con Previous deshabilitado y Next habilitado", () => {
    render(<Pagination currentPage={1} totalPages={3} />);

    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();

    expect(screen.getByText("← Previous")).toBeInTheDocument();

    const nextLink = screen.getByRole("link", { name: /Next/i });
    expect(nextLink).toHaveAttribute("href", "/?page=2");
  });

  it("muestra los botones Previous y Next cuando está en una página intermedia", () => {
    render(<Pagination currentPage={2} totalPages={3} />);

    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();

    const previousLink = screen.getByRole("link", { name: /Previous/i });
    const nextLink = screen.getByRole("link", { name: /Next/i });

    expect(previousLink).toHaveAttribute("href", "/?page=1");
    expect(nextLink).toHaveAttribute("href", "/?page=3");
  });

  it("muestra la última página con Next deshabilitado", () => {
    render(<Pagination currentPage={3} totalPages={3} />);

    expect(screen.getByText("Page 3 of 3")).toBeInTheDocument();

    const previousLink = screen.getByRole("link", { name: /Previous/i });

    expect(previousLink).toHaveAttribute("href", "/?page=2");
    expect(screen.getByText("Next →")).toBeInTheDocument();
  });
});