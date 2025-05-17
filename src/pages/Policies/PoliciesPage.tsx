import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PATHS } from '../../utils/pathconfig';
import './PoliciesPage.css';

interface PolicyType {
  id: string;
  title: string;
  category: string;
  summary: string;
}

// This will eventually be replaced with actual data from an API or data file
const DUMMY_POLICIES = [
  { 
    id: 'safety-guidelines', 
    title: 'Safety Guidelines', 
    category: 'Safety',
    summary: 'Essential safety procedures for all Kidz Team members.'
  },
  { 
    id: 'check-in-process', 
    title: 'Check-in Process', 
    category: 'Operations',
    summary: 'Standard procedures for child check-in and check-out.'
  },
  { 
    id: 'classroom-management', 
    title: 'Classroom Management', 
    category: 'Teaching',
    summary: 'Best practices for managing the classroom environment.'
  },
  { 
    id: 'volunteer-expectations', 
    title: 'Volunteer Expectations', 
    category: 'Team',
    summary: 'What we expect from all Kidz Team volunteers.'
  },
  { 
    id: 'emergency-procedures', 
    title: 'Emergency Procedures', 
    category: 'Safety',
    summary: 'What to do in case of various emergency situations.'
  },
  { 
    id: 'food-allergies', 
    title: 'Food Allergy Protocols', 
    category: 'Safety',
    summary: 'How to handle food allergies and dietary restrictions.'
  }
];

const PoliciesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const location = useLocation();
  
  // Extract search query from URL parameters if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  // Extract unique categories
  const categories = ['All', ...new Set(DUMMY_POLICIES.map(policy => policy.category))];

  // Filter policies based on search and category
  const filteredPolicies = DUMMY_POLICIES.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || policy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="policies-page">
      <div className="page-header">
        <h1>Kidz Team Policies</h1>
        <p>Standard policies and procedures for all Kidz Team members</p>
      </div>
      
      <div className="filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
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
