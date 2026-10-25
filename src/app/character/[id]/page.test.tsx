import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/api", () => ({
  getCharacter: vi.fn(),
  getEpisodes: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { getCharacter, getEpisodes } from "@/lib/api";
import CharacterPage from "./page";

const createCharacter = (overrides: any = {}) => ({
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  type: "Scientist",
  gender: "Male",
  origin: {
    name: "Earth",
    url: "",
  },
  location: {
    name: "Earth",
    url: "",
  },
  image: "https://example.com/rick.jpg",
  episode: [
    "https://rickandmortyapi.com/api/episode/1",
    "https://rickandmortyapi.com/api/episode/2",
  ],
  url: "",
  created: "2017-01-01T00:00:00.000Z",
  ...overrides,
});

const mockEpisodes = [
  {
    id: 1,
    name: "Pilot",
    episode: "S01E01",
    air_date: "December 2, 2013",
  },
  {
    id: 2,
    name: "Lawnmower Dog",
    episode: "S01E02",
    air_date: "December 9, 2013",
  },
];

describe("CharacterPage", () => {
  it("muestra correctamente un personaje con episodios", async () => {
    vi.mocked(getCharacter).mockResolvedValue(
      createCharacter() as any
    );

    vi.mocked(getEpisodes).mockResolvedValue(mockEpisodes as any);

    const element = await CharacterPage({
      params: Promise.resolve({ id: "1" }),
    });

    render(element);

    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    expect(screen.getByText("Alive - Human")).toBeInTheDocument();
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("Scientist")).toBeInTheDocument();
    expect(screen.getAllByText("Earth")).toHaveLength(2);

    expect(screen.getByText("Episodes (2)")).toBeInTheDocument();
    expect(screen.getByText("S01E01")).toBeInTheDocument();
    expect(screen.getByText("S01E02")).toBeInTheDocument();

    expect(getCharacter).toHaveBeenCalledWith("1");
    expect(getEpisodes).toHaveBeenCalledWith(["1", "2"]);
  });

  it("muestra Unknown cuando el tipo del personaje está vacío", async () => {
    vi.mocked(getCharacter).mockResolvedValue(
      createCharacter({
        type: "",
      }) as any
    );

    vi.mocked(getEpisodes).mockResolvedValue([]);

    const element = await CharacterPage({
      params: Promise.resolve({ id: "2" }),
    });

    render(element);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(screen.getByText("Episodes (0)")).toBeInTheDocument();
  });

  it("muestra el estado Dead", async () => {
    vi.mocked(getCharacter).mockResolvedValue(
      createCharacter({
        status: "Dead",
      }) as any
    );

    vi.mocked(getEpisodes).mockResolvedValue([]);

    const element = await CharacterPage({
      params: Promise.resolve({ id: "3" }),
    });

    render(element);

    expect(screen.getByText("Dead - Human")).toBeInTheDocument();
  });

  it("usa el color por defecto para un estado desconocido", async () => {
    vi.mocked(getCharacter).mockResolvedValue(
      createCharacter({
        status: "unknown",
      }) as any
    );

    vi.mocked(getEpisodes).mockResolvedValue([]);

    const element = await CharacterPage({
      params: Promise.resolve({ id: "4" }),
    });

    render(element);

    expect(screen.getByText("unknown - Human")).toBeInTheDocument();
  });
});