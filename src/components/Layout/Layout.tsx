import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Background from '../Background/Background';
import SearchBar from '../SearchBar/SearchBar';
import tinyLlamaSearch from '../../services/searchService';
import './Layout.css';

/**
 * Main layout component that wraps all pages
 * Provides consistent structure with header and footer
 */
const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're on the home page - either exactly '/' or undefined path
  const isHomePage = location.pathname === '/' || location.pathname === '';
  
  // Debug the current location
  useEffect(() => {
    console.log('Current location path:', location.pathname);
    console.log('Is home page:', isHomePage);
  }, [location.pathname, isHomePage]);

  // State to track when search is in progress
  const [isSearching, setIsSearching] = useState<boolean>(false);
  // State for search answer display
  const [searchAnswer, setSearchAnswer] = useState<string>('');
  // State to control if the answer is visible
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  // Store the current policy path for navigation
  const [policyPath, setPolicyPath] = useState<string>('');

  // Initialize R.ai in the background when component mounts
  useEffect(() => {
    tinyLlamaSearch.initModel();
  }, []);
  
  // Function to generate simulated AI responses based on the search query
  const generateSimulatedResponse = (query: string): { answer: string; policyPath: string } => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('check-in')) {
      return {
        answer: 'Child check-in procedures require matching security tags for each child and guardian. Volunteers must verify the tags match before releasing a child. For safety reasons, only authorized guardians with matching tags may pick up children.',
        policyPath: '/policies/checkin'
      };
    } else if (lowerQuery.includes('volunteer')) {
      return {
        answer: 'All Kidz Team volunteers must be committed followers of Christ, complete a background check, attend volunteer orientation, and follow all safety protocols. Volunteers should arrive 30 minutes before service and stay 15 minutes after to ensure proper supervision.',
        policyPath: '/policies/volunteers'
      };
    } else if (lowerQuery.includes('safety') || lowerQuery.includes('security')) {
      return {
        answer: 'Safety procedures include maintaining proper adult-to-child ratios, ensuring secure check-in/out, regular equipment inspections, and adherence to allergy protocols. All security incidents must be reported immediately to the children\'s ministry director.',
        policyPath: '/policies/safety'
      };
    } else if (lowerQuery.includes('training') || lowerQuery.includes('orientation')) {
      return {
        answer: 'New volunteer training includes classroom management techniques, emergency procedures, curriculum overview, and child development basics. All volunteers must attend refresher training sessions quarterly.',
        policyPath: '/policies/training'
      };
    } else {
      return {
        answer: `Based on your search for "${query}", here are key points from our Kidz Ministry policies: We prioritize child safety, positive learning environments, and age-appropriate biblical teaching. Our goal is to partner with families in nurturing children's spiritual growth.`,
        policyPath: '/policies'
      };
    }
  };

  
  // Handle search submission using R.ai
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      // Reset previous search results
      setShowAnswer(false);
      setIsSearching(true);
      
      // Use R.ai to enhance the search query (simulated for now)
      const enhancedQuery = await tinyLlamaSearch.enhanceQuery(query);
      console.log('Enhanced query:', enhancedQuery);
      
      // Generate a simulated response based on the enhanced query
      const responseObj = generateSimulatedResponse(enhancedQuery);
      setSearchAnswer(responseObj.answer);
      setPolicyPath(responseObj.policyPath);
      setShowAnswer(true);
      
      // Now we'll just show the answer and let the user choose when to navigate
      // via the 'View Full Policy' button or related policy links
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setShowAnswer(true);
      setIsSearching(false);
    }
  };
  
  return (
    <div className="app-layout">
      <Background />
      <Header />
      
      <div className="global-search-container">
        <div className="ai-badge">
          <span>R.ai</span>
        </div>
        <div className="container">
          <SearchBar
            placeholder="Search policies, procedures, and resources..."
            onSearch={handleSearch}
            showTagline={isHomePage}
            isSearching={isSearching}
          />
          
          {showAnswer && (
            <div className="search-answer-container">
              <div className="answer-header">
                <div className="answer-badge">R.ai Response</div>
                <button
                  className="close-answer-btn"
                  onClick={() => setShowAnswer(false)}
                  aria-label="Close answer"
                >
                  ×
                </button>
              </div>
              <div className="answer-content">
                {searchAnswer}
                <div className="view-policy-btn-container">
                  <button 
                    className="view-policy-btn"
                    onClick={() => navigate(policyPath)}
                  >
                    View Full Policy →
                  </button>
                </div>
              </div>
              <div className="related-policies">
                <h4>Related Policies</h4>
                <div className="related-links">
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/policies/checkin'); }}>Child Check-in</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/policies/safety'); }}>Safety Procedures</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/policies/volunteers'); }}>Volunteer Guidelines</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/policies/training'); }}>Training Resources</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <main className={`main-content ${isHomePage ? 'home-layout' : ''}`}>
        <div className="container">
          <Outlet />
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Redefine Church. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
