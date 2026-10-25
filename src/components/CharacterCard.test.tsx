import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CharacterCard from "./CharacterCard";

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

const createCharacter = (status: "Alive" | "Dead" | "unknown" | string) => ({
  id: 1,
  name: "Rick Sanchez",
  status,
  species: "Human",
  type: "",
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
  episode: [],
  url: "",
  created: "",
});

describe("CharacterCard", () => {
  it("muestra correctamente un personaje vivo", () => {
    render(<CharacterCard character={createCharacter("Alive")} />);

    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    expect(screen.getByText("Alive - Human")).toBeInTheDocument();
    expect(screen.getByText("Earth")).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/character/1");
  });

  it("muestra correctamente un personaje muerto", () => {
    render(<CharacterCard character={createCharacter("Dead")} />);

    expect(screen.getByText("Dead - Human")).toBeInTheDocument();
  });

  it("muestra correctamente un personaje con estado unknown", () => {
    render(<CharacterCard character={createCharacter("unknown")} />);

    expect(screen.getByText("unknown - Human")).toBeInTheDocument();
  });

  it("usa el color por defecto para un estado no reconocido", () => {
    render(<CharacterCard character={createCharacter("Other")} />);

    expect(screen.getByText("Other - Human")).toBeInTheDocument();
  });
});