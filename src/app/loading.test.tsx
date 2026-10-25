import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Loading from "./loading";

describe("Loading", () => {
  it("renderiza el estado de carga", () => {
    const { container } = render(<Loading />);

    const skeletons = container.querySelectorAll(".animate-pulse");

    expect(skeletons.length).toBe(9);
  });
});