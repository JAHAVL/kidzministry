import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './SearchBar.css';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (term: string) => void;
  showTagline?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search...',
  onSearch,
  showTagline = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="search-bar-container">
      {showTagline && (
        <h2 className="search-tagline">Discover resources for Redefine Kidz Ministry</h2>
      )}
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button" aria-label="Search">
          <FiSearch size={28} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
