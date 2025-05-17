import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Background from '../Background/Background';
import SearchBar from '../SearchBar/SearchBar';
import tinyLlamaSearch from '../../services/searchService';
import { POLICY_DATA } from '../../data/policyData';
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
  // We're using the embedded model - no need to track real/fallback states

  // Initialize R.ai in the background when component mounts
  useEffect(() => {
    // Add additional debugging to browser console
    console.log('Starting R.ai initialization...');
    
    // Load policy data first - this is needed for both mock and real responses
    tinyLlamaSearch.setPolicyData(POLICY_DATA);
    console.log('Policy data loaded for R.ai search');
    
    // Create a loading indicator in UI for better UX
    setIsSearching(true);
    
    // Initialize the model with proper error handling
    const initializeAI = async () => {
      try {
        const success = await tinyLlamaSearch.initModel();
        console.log('AI model initialization result:', success ? 'SUCCESS' : 'FAILED');
        if (success) {
          // Test the model with a simple query
          const testResponse = await tinyLlamaSearch.generateResponse('test');
          console.log('AI test response:', testResponse);
        }
      } catch (error) {
        console.error('Error during AI initialization:', error);
      } finally {
        setIsSearching(false);
      }
    };
    
    // Start the initialization process
    initializeAI();
  }, []);
  
  // We're now using the real TinyLlama model to generate responses instead of simulated ones

  
  // Handle search submission using ONLY real R.ai (TinyLlama) integration - no fallbacks
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      // Reset previous search results
      setShowAnswer(false);
      setIsSearching(true);
      
      // Display an error if we try to search before the AI is ready
      const modelLoaded = tinyLlamaSearch.isLoaded();
      console.log('AI model loaded status before search:', modelLoaded);
      
      if (!modelLoaded) {
        console.log('Starting model initialization...');
        // Show a loading message while we try to load the model
        setSearchAnswer('Loading R.ai model. This may take a moment for the first search...');
        setShowAnswer(true);
      }
      
      // Get the response from the real AI model (this will throw an error if model can't be used)
      const responseObj = await tinyLlamaSearch.generateResponse(query);
      console.log('R.ai response generated successfully for:', query);
      
      // Successfully generated response
      
      // Update UI with the AI response
      setSearchAnswer(responseObj.answer);
      setPolicyPath(responseObj.policyPath);
      setShowAnswer(true);
    } catch (error: any) {
      console.error('⚠️ AI search error:', error);
      // Show the error message from the AI system
      setSearchAnswer(`R.ai could not process your query. ${error.message || 'Please try again in a few moments.'}`);
      setPolicyPath('/policies');
      setShowAnswer(true);
      // Error encountered, but we'll still show a helpful message
    } finally {
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
                <div>
                  <span className="answer-badge">R.ai Answer</span>
                </div>
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
