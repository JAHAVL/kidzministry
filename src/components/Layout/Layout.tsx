import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Background from '../Background/Background';
import SearchBar from '../SearchBar/SearchBar';
import './Layout.css';
import searchService from '../../services/searchService';
import { POLICY_DATA } from '../../data/policyData';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';

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
  // Store the current policy ID for navigation
  const [policyId, setPolicyId] = useState<string>('');
  // Store related policy IDs for suggesting other policies
  const [relatedPolicyIds, setRelatedPolicyIds] = useState<string[]>([]);
  // Store related policy sections for suggesting other policies
  const [relatedPolicySections, setRelatedPolicySections] = useState<Array<{id: string; section: string}>>([]);
  // We're using the embedded model - no need to track real/fallback states

  // Initialize R.ai in the background when component mounts
  useEffect(() => {
    // Add additional debugging to browser console
    console.log('Starting R.ai initialization...');
    
    // Load policy data first - this is needed for both mock and real responses
    searchService.setPolicyData(POLICY_DATA);
    console.log('Policy data loaded for R.ai search');
    
    // Create a loading indicator in UI for better UX
    setIsSearching(true);
    
    // Initialize the model with proper error handling
    const initializeAI = async () => {
      try {
        const success = await searchService.initModel();
        console.log('AI model initialization result:', success ? 'SUCCESS' : 'FAILED');
        if (success) {
          // Test the model with a simple query
          const testResponse = await searchService.generateResponse('test');
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
      const modelLoaded = searchService.isLoaded();
      console.log('AI model loaded status before search:', modelLoaded);
      
      if (!modelLoaded) {
        console.log('Starting model initialization...');
        // Show a loading message while we try to load the model
        setSearchAnswer('Loading R.ai model. This may take a moment for the first search...');
        setShowAnswer(true);
      }
      
      // Get the response from the real AI model (this will throw an error if model can't be used)
      const responseObj = await searchService.generateResponse(query);
      console.log('R.ai response generated successfully for:', query);
      console.log('RESPONSE OBJECT:', responseObj);
      console.log('Related policy IDs:', responseObj.relatedPolicyIds);
      console.log('Related policy sections:', responseObj.relatedPolicySections);
      
      // Successfully generated response
      
      // Update UI with the AI response
      setSearchAnswer(responseObj.answer);
      setPolicyId(responseObj.policyId); 
      setRelatedPolicyIds(responseObj.relatedPolicyIds);
      
      // Store section names if available
      if (responseObj.relatedPolicySections && responseObj.relatedPolicySections.length > 0) {
        console.log('Related policy sections:', responseObj.relatedPolicySections);
        setRelatedPolicySections(responseObj.relatedPolicySections);
      } else {
        console.log('No related policy sections found in response');
        setRelatedPolicySections([]);
      }
      
      setShowAnswer(true);
    } catch (error: any) {
      console.error('⚠️ AI search error:', error);
      // Show the error message from the AI system
      setSearchAnswer(`R.ai could not process your query. ${error.message || 'Please try again in a few moments.'}`);
      setPolicyId(''); // Empty policy ID for error state
      setRelatedPolicyIds([]); // No related policies in error state
      setRelatedPolicySections([]); // No related policy sections in error state
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
            placeholder="I'm R.ai, how can I help you today?"
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
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize, rehypeHighlight]}
                >{searchAnswer}</ReactMarkdown>
                <div className="view-policy-btn-container">
                  <button 
                    className="view-policy-btn"
                    onClick={() => {
                      // Define valid policy IDs
                      const validPolicyIds = [
                        'movement-vision',
                        'team-guidelines',
                        'safety-policies',
                        'behavior-guidelines-and-discipline',
                        'communication-policies',
                        'training-development',
                        'appendix'
                      ];
                      
                      // Check if we have a valid policy ID that exists in our data
                      if (policyId && validPolicyIds.includes(policyId)) {
                        console.log(`Navigating to valid policy: ${policyId}`);
                        navigate(`/policies/${policyId}`);
                      } else {
                        // If invalid or missing policy ID, default to policies index
                        console.log(`Invalid policy ID: ${policyId}, redirecting to policies index`);
                        navigate('/policies');
                      }
                    }}
                  >
                    View Full Policy →
                  </button>
                </div>
              </div>
              <div className="related-policies">
                <h4>Related Policies</h4>
                <div className="related-links">
                  {relatedPolicySections.length > 0 ? (
                    // Map through the section names and related policy IDs
                    relatedPolicySections.map(({id, section}) => {
                      // Check if this section is related to dress code
                      const isDressCodeSection = (
                        section.toLowerCase().includes('dress') ||
                        section.toLowerCase().includes('clothing') ||
                        section.toLowerCase().includes('attire') ||
                        section.toLowerCase().includes('uniform') ||
                        section.toLowerCase().includes('modesty')
                      );
                      
                      // For dress code sections, override the ID to always link to behavior guidelines
                      const targetId = isDressCodeSection ? 'behavior-guidelines-and-discipline' : id;
                      
                      return (
                        <a 
                          key={id + '-' + section} 
                          href="#" 
                          onClick={(e) => { 
                            e.preventDefault();
                            console.log(`Navigating to section: ${section}, ID: ${targetId}`);
                            navigate(`/policies/${targetId}`); 
                          }}
                        >
                          {section} {/* Show the section heading as the link text */}
                        </a>
                      );
                    })
                  ) : relatedPolicyIds.length > 0 ? (
                    // Fallback to policy IDs if we have IDs but no sections
                    relatedPolicyIds.map(relatedId => {
                      // Find the policy in our data to get its title
                      const policy = POLICY_DATA.find(p => p.id === relatedId);
                      return policy ? (
                        <a 
                          key={relatedId} 
                          href="#" 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            navigate(`/policies/${relatedId}`); 
                          }}
                        >
                          {policy.title.replace(/^\d+\.\s*/, '')} {/* Remove numbering if present */}
                        </a>
                      ) : null;
                    })
                  ) : (
                    // Better fallbacks with section headings rather than policy titles
                    <>
                      <a href="#" onClick={(e) => { e.preventDefault(); navigate('/policies/team-guidelines'); }}>Weekly Schedule</a>
                      <a href="#" onClick={(e) => { e.preventDefault(); navigate('/policies/safety-policies'); }}>Check-In Procedures</a>
                      <a href="#" onClick={(e) => { e.preventDefault(); navigate('/policies/behavior-guidelines-and-discipline'); }}>Dress Code</a>
                    </>
                  )}
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
