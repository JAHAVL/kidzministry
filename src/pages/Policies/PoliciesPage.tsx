import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PATHS } from '../../utils/pathconfig';
import { POLICY_DATA, Policy } from '../../data/policyData';
import searchService from '../../services/searchService';
import './PoliciesPage.css';

// We use the Policy interface directly from policyData.ts

const PoliciesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Policy[]>([]);
  const location = useLocation();
  
  // Initialize search service with policy data
  useEffect(() => {
    searchService.setPolicyData(POLICY_DATA);
    // Pre-initialize the model in background
    searchService.initializeModel().catch(err => console.error('Failed to pre-initialize TinyLlama:', err));
  }, []);
  
  // Extract search query from URL parameters if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
      handleSearch(searchQuery);
    }
  }, [location.search]);

  // Handle search using TinyLlama
  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      setSearchResults(POLICY_DATA);
      return;
    }
    
    setIsSearching(true);
    try {
      // Use semantic search with TinyLlama
      const results = await searchService.semanticSearch(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to basic search if TinyLlama fails
      setSearchResults(searchService.basicSearch(query));
    } finally {
      setIsSearching(false);
    }
  };

  // Extract unique categories
  const categories = ['All', ...new Set(POLICY_DATA.map(policy => policy.category))];

  // Determine which policies to display
  const getPolicies = () => {
    // If no search term, show all or filtered by category
    if (searchTerm.trim() === '' && searchResults.length === 0) {
      return POLICY_DATA.filter(policy => 
        selectedCategory === 'All' || policy.category === selectedCategory
      );
    }
    
    // Otherwise filter search results by category
    return searchResults.filter(policy => 
      selectedCategory === 'All' || policy.category === selectedCategory
    );
  };
  
  const filteredPolicies = getPolicies();

  return (
    <div className="policies-page">
      <div className="page-header">
        <h1>Kidz Team Policies</h1>
        <p>Standard policies and procedures for all Kidz Team members</p>
      </div>
      
      <div className="filter-container">
        <div className="search-box">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchTerm);
          }}>
            <input
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isSearching}
            />
            <button type="submit" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
          {isSearching && <div className="search-loading">Using TinyLlama for intelligent search...</div>}
        </div>
        
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
              disabled={isSearching}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="policies-list">
        {filteredPolicies.length > 0 ? (
          filteredPolicies.map(policy => (
            <Link 
              to={`${PATHS.POLICIES}/${policy.id}`} 
              className="policy-card"
              key={policy.id}
              onClick={() => {
                // Ensure the correct policy is being linked
                console.log('Navigating to policy:', policy.title, 'with ID:', policy.id);
              }}
            >
              <div className="card-content">
                <h3>{policy.title}</h3>
                <span className="category-tag">{policy.category}</span>
                <p>{policy.summary}</p>
              </div>
              <div className="card-action">
                <span>View Details</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">
            <p>No policies found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliciesPage;
