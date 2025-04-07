import React, { useState, useEffect } from 'react';

interface LocationAutocompleteProps {
  value: string;
  onChange: (address: string, displayValue?: string) => void;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (inputValue.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}`)
        .then(response => response.json())
        .then(data => {
          setSuggestions(data.map((item: any) => item.display_name));
        });
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    onChange(suggestion);
  };

  return (
    <div className="location-autocomplete">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter a location"
        className="bg-background/60"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
