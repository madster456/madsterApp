/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import { ipv6ToNumber, MAX_IPv6, normalizeIPv6 } from "@/lib/everyip/ip-utils";
import { AddressService } from "@/lib/everyip/address-service";

interface SearchBarProps {
  onSearch: (position: BigNumber) => void;
  onQueryChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onQueryChange }) => {
  const [error, setError] = useState<string>("");
  const [value, setValue] = useState("");

  const handleSearch = (query: string) => {
    setValue(query);
    const trimmedQuery = query.trim();
    setError("");
    onQueryChange(trimmedQuery);

    if (!trimmedQuery) return;

    try {
      const position = AddressService.searchAddress(trimmedQuery);
      if (position.isGreaterThan(MAX_IPv6) || position.isLessThan(0)) {
        setError("Address out of range");
        return;
      }
      onSearch(position);
    } catch {
      if (!trimmedQuery.match(/^[0-9a-fA-F:]+$/)) {
        setError("Invalid IPv6 address");
      }
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={value}
        placeholder="Enter IPv6 address (e.g., ::1)"
        onChange={(e) => handleSearch(e.target.value)}
        className={`w-full px-4 py-2 rounded-lg border ${
          error ? "border-red-300" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SearchBar;
