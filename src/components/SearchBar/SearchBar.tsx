import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './SearchBar.css';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (term: string) => void;
  showTagline?: boolean;
  isSearching?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search...',
  onSearch,
  showTagline = true,
  isSearching = false
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
          placeholder={isSearching ? 'Searching with R.ai...' : placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isSearching}
        />
        <button 
          type="submit" 
          className={`search-button ${isSearching ? 'loading' : ''}`} 
          aria-label="Search"
          disabled={isSearching}
        >
          {isSearching ? 
            <div className="spinner"></div> : 
            <FiSearch size={42} />
          }
        </button>
      </form>
      {isSearching && 
        <div className="search-message">
          Using R.ai to enhance your search...
        </div>
      }
    </div>
  );
};

export default SearchBar;
