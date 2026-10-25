import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

vi.mock("@/lib/api", () => ({
  getCharacters: vi.fn(),
}));

vi.mock("@/components/CharacterCard", () => ({
  default: ({ character }: any) => (
    <div data-testid="character-card">{character.name}</div>
  ),
}));

vi.mock("@/components/Pagination", () => ({
  default: ({ currentPage, totalPages }: any) => (
    <div data-testid="pagination">
      Page {currentPage} of {totalPages}
    </div>
  ),
}));

import { getCharacters } from "@/lib/api";

const mockCharacters = {
  info: {
    count: 2,
    pages: 2,
    next: "next-url",
    prev: null,
  },
  results: [
    {
      id: 1,
      name: "Rick Sanchez",
    },
    {
      id: 2,
      name: "Morty Smith",
    },
  ],
};

describe("Home", () => {
  it("muestra los personajes y la paginación de la página indicada", async () => {
    vi.mocked(getCharacters).mockResolvedValue(mockCharacters as any);

    const element = await Home({
      searchParams: Promise.resolve({ page: "2" }),
    });

    render(element);

    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    expect(screen.getByText("Morty Smith")).toBeInTheDocument();
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();

    expect(getCharacters).toHaveBeenCalledWith(2);
  });

  it("usa la página 1 cuando no se proporciona page", async () => {
    vi.mocked(getCharacters).mockResolvedValue(mockCharacters as any);

    const element = await Home({
      searchParams: Promise.resolve({}),
    });

    render(element);

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    expect(getCharacters).toHaveBeenCalledWith(1);
  });

  it("usa la página 1 cuando page no es un string", async () => {
    vi.mocked(getCharacters).mockResolvedValue(mockCharacters as any);

    const element = await Home({
      searchParams: Promise.resolve({
        page: ["2"],
      }),
    });

    render(element);

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    expect(getCharacters).toHaveBeenCalledWith(1);
  });
});