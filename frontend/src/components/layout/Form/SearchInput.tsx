"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { SearchInputProps } from "@/src/types/components/layout/Form/Form";
import "@/src/styles/components/layout/form.css";

export function SearchInput({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  name, 
  required,
  width = "100",
  isMulti = false
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValues = useMemo(() => {
    if (isMulti) return Array.isArray(value) ? value : [];
    return value !== undefined && value !== null ? [value] : [];
  }, [value, isMulti]);

  const selectedOptions = useMemo(() => 
    options.filter((option) => selectedValues.includes(option.value)), 
    [options, selectedValues]
  );

  const filteredOptions = useMemo(() => {
    const normalizedSearchTerm = searchTerm.toLowerCase();
    
    return options.filter((option) => 
      option.label.toLowerCase().includes(normalizedSearchTerm) &&
      (!isMulti || !selectedValues.includes(option.value))
    );
  }, [options, searchTerm, selectedValues, isMulti]);

  const displayValue = isDropdownOpen ? searchTerm : (isMulti ? "" : (selectedOptions[0]?.label || ""));

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
    if (isMulti) {
      const newValue = [...selectedValues, optionValue];
      onChange?.({ target: { name, value: newValue } });
      setSearchTerm("");
    } else {
      onChange?.({ target: { name, value: optionValue } });
      setSearchTerm("");
      setIsDropdownOpen(false);
    }
  };

  const handleRemoveOption = (optionValue: string | number) => {
    const newValue = selectedValues.filter(v => v !== optionValue);
    onChange?.({ target: { name, value: newValue } });
  };

  return (
    <div className={`search-input-container width-${width}`} ref={containerRef}>
      <div className={`form-input-container ${isMulti ? 'search-multi-container' : ''}`}>
        {isMulti && (
          <div className="search-multi-tags">
            {selectedOptions.map(option => (
              <span key={option.value} className="search-tag">
                {option.label}
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveOption(option.value);
                  }}
                  className="search-tag-remove"
                >
                  <MdClose size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
        
        <input
          type="text"
          className={`form-input ${isMulti ? 'search-multi-input' : ''}`}
          placeholder={selectedOptions.length === 0 ? placeholder : ""}
          value={displayValue}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          autoComplete="off"
        />
        
        <input 
          type="hidden" 
          name={name} 
          value={isMulti ? JSON.stringify(selectedValues) : (value as string | number || "")} 
          required={required} 
        />
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
            <li className="search-no-results">
              {searchTerm ? "No results found" : "Start typing to search..."}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
