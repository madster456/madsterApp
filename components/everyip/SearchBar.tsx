/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import BigNumber from "bignumber.js";

interface SearchBarProps {
  onSearch: (position: BigNumber) => void;
  onQueryChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onQueryChange }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(query);
    onQueryChange(query);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    // Small delay to allow clicking suggestions
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue(suggestion);
    onQueryChange(suggestion);
  };

  return (
    <div className="relative w-96">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search IPv6 address..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10 p-2">
          <div className="text-sm text-gray-500 mb-2">Try these addresses:</div>
          <div className="space-y-2">
            <div
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => handleSuggestionClick("fe80:")}
            >
              <div className="font-mono">fe80:</div>
              <div className="text-xs text-gray-600">
                Link-local addresses for local network communication
              </div>
            </div>
            <div
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => handleSuggestionClick("2001:db8:")}
            >
              <div className="font-mono">2001:db8:</div>
              <div className="text-xs text-gray-600">
                Documentation range for examples
              </div>
            </div>
            <div
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => handleSuggestionClick("2606:4700:4700::1111")}
            >
              <div className="font-mono">2606:4700:4700::1111</div>
              <div className="text-xs text-gray-600">
                Cloudflare DNS (1.1.1.1)
              </div>
            </div>
            <div
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => handleSuggestionClick("2620:fe::fe")}
            >
              <div className="font-mono">2620:fe::fe</div>
              <div className="text-xs text-gray-600">
                Google Public DNS (8.8.8.8)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
