import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCharacter,
  getCharacters,
  getEpisodes,
} from "./api";

describe("API", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("getCharacters", () => {
    it("obtiene los personajes correctamente", async () => {
      const data = {
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
        results: [],
      };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => data,
        })
      );

      const result = await getCharacters(2);

      expect(result).toEqual(data);
      expect(fetch).toHaveBeenCalledWith(
        "https://rickandmortyapi.com/api/character?page=2"
      );
    });

    it("lanza un error cuando la API falla", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
        })
      );

      await expect(getCharacters(1)).rejects.toThrow(
        "Failed to fetch characters"
      );
    });
  });

  describe("getCharacter", () => {
    it("obtiene un personaje correctamente", async () => {
      const character = {
        id: 1,
        name: "Rick Sanchez",
      };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => character,
        })
      );

      const result = await getCharacter("1");

      expect(result).toEqual(character);
      expect(fetch).toHaveBeenCalledWith(
        "https://rickandmortyapi.com/api/character/1"
      );
    });

    it("lanza un error cuando la API falla", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
        })
      );

      await expect(getCharacter("999")).rejects.toThrow(
        "Failed to fetch character details"
      );
    });
  });

  describe("getEpisodes", () => {
    it("devuelve un array vacío cuando no recibe IDs", async () => {
      const result = await getEpisodes([]);

      expect(result).toEqual([]);
      expect(fetch).not.toHaveBeenCalled();
    });

    it("obtiene varios episodios correctamente", async () => {
      const episodes = [
        {
          id: 1,
          name: "Pilot",
        },
        {
          id: 2,
          name: "Lawnmower Dog",
        },
      ];

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => episodes,
        })
      );

      const result = await getEpisodes(["1", "2"]);

      expect(result).toEqual(episodes);
      expect(fetch).toHaveBeenCalledWith(
        "https://rickandmortyapi.com/api/episode/1,2"
      );
    });

    it("convierte un episodio individual en un array", async () => {
      const episode = {
        id: 1,
        name: "Pilot",
      };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => episode,
        })
      );

      const result = await getEpisodes(["1"]);

      expect(result).toEqual([episode]);
    });

    it("lanza un error cuando la API falla", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
        })
      );

      await expect(getEpisodes(["1"])).rejects.toThrow(
        "Failed to fetch episodes"
      );
    });
  });
});