"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "@/src/styles/components/layout/form.css";

interface Option {
  label: string;
  value: string | number;
}

interface SearchInputProps {
  options: Option[];
  value?: string | number;
  onChange?: (event: { target: { name: string; value: string | number } }) => void;
  placeholder?: string;
  name: string;
  required?: boolean;
}

export function SearchInput({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  name, 
  required 
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(() => 
    options.find((option) => option.value === value), 
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const normalizedSearchTerm = searchTerm.toLowerCase();
    if (!normalizedSearchTerm) return options;
    
    return options.filter((option) => 
      option.label.toLowerCase().includes(normalizedSearchTerm)
    );
  }, [options, searchTerm]);

  const displayValue = isDropdownOpen ? searchTerm : (selectedOption?.label || "");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectOption = (optionValue: string | number) => {
    if (onChange) {
      onChange({ target: { name, value: optionValue } });
    }
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="search-input-container" ref={containerRef}>
      <div className="form-input-container">
        <input
          type="text"
          className="form-input"
          placeholder={placeholder}
          value={displayValue}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          autoComplete="off"
        />
        <input type="hidden" name={name} value={value || ""} />
        <FaSearch className="select-icon" size={14} />
      </div>
      
      {isDropdownOpen && (
        <ul className="search-results-dropdown">
          {filteredOptions.map((option) => (
            <li 
              key={option.value}
              className="search-result-item"
              onClick={() => handleSelectOption(option.value)}
            >
              {option.label}
            </li>
          ))}
          {filteredOptions.length === 0 && (
            <li className="search-no-results">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}
