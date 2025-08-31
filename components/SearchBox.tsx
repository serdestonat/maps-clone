"use client";

import { useState } from "react";

type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function SearchBox({
  onSelect,
}: {
  onSelect: (coords: [number, number]) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`
    );

    const data: SearchResult[] = await res.json();
    setResults(data);

    // if (data.length > 0) {
    //   const { lat, lon } = data[0];
    //   onSelect([parseFloat(lat), parseFloat(lon)]);
    // }
  }

  function handleSelect(result: SearchResult) {
    const coords: [number, number] = [
      parseFloat(result.lat),
      parseFloat(result.lon),
    ];
    onSelect(coords);
    setResults([]);
    setQuery(result.display_name);
  }

  return (
    <div className="absolute top-1.5 left-1.5 -translate-x-0.5 z-[1000] bg-white p-2 rounded shadow text-black">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Looking for a place ?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white px-3 py-2 rounded"
        >
          Search
        </button>
      </form>

      {results.length > 0 && (
        <ul className="mt-2 border rounded max-h-48 overflow-y-auto">
          {results.map((r, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(r)}
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
