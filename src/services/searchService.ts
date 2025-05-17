import { Policy } from '../data/policyData';
import { findRelevantPolicies, generateResponse } from '../models/embeddedModel';

/**
 * TinyLlama implementation for Redefine Church's Kidz Ministry
 * Using an embedded model bundled with the app instead of downloading at runtime
 */
class TinyLlamaSearchService {
  // Our embedded model is always available and bundled with the app
  private policyData: Policy[] = [];

  /**
   * Initialize the embedded model
   * This is always successful since the model is bundled with the app
   */
  async initModel(): Promise<boolean> {
    console.log('Initializing embedded model...');
    console.log('✅ Embedded model ready!');
    return true;
  }
  
  /**
   * Check if the model is loaded - always true for embedded model
   */
  isLoaded(): boolean {
    return true;
  }
  
  /**
   * Check if the model is currently loading - always false for embedded model
   */
  isLoading(): boolean {
    return false;
  }
  
  /**
   * Check if we're using fallback mode instead of real AI - always false for embedded model
   */
  isUsingFallback(): boolean {
    return false;
  }
  
  /**
   * Set the policy data for search operations
   */
  setPolicyData(policies: Policy[]): void {
    this.policyData = policies;
  }
  
  /**
   * Initialize TinyLlama model - alias for initModel with better naming
   */
  async initializeModel(): Promise<boolean> {
    return this.initModel();
  }

  /**
   * Perform semantic search using our embedded model to find matching policies
   */
  async semanticSearch(query: string): Promise<Policy[]> {
    console.log('Performing semantic search with embedded model...');
    // Use our embedded semantic search implementation
    return findRelevantPolicies(query, this.policyData);
  }
  
  /**
   * Generate an AI response based on a query and matching policies using our embedded model
   * @param query User's search query
   * @returns Object containing the AI-generated answer and the most relevant policy path
   */
  async generateResponse(query: string): Promise<{ answer: string; policyPath: string }> {
    try {
      // Find relevant policies using our embedded semantic search
      const relevantPolicies = await this.semanticSearch(query);
      
      if (relevantPolicies.length === 0) {
        return {
          answer: `I couldn't find specific information about "${query}" in our policies. Please try a different question or browse our policies directly.`,
          policyPath: '/policies'
        };
      }
      
      const mostRelevantPolicy = relevantPolicies[0]; // Get the most relevant one
      
      // Generate response using our embedded model
      const answer = generateResponse(query, mostRelevantPolicy);
      console.log('Generated answer with embedded model');
      
      // Determine the policy path based on the most relevant policy
      let policyPath = '/policies';
      if (mostRelevantPolicy) {
        if (mostRelevantPolicy.id === 'team' || mostRelevantPolicy.title.toLowerCase().includes('volunteer')) {
          policyPath = '/policies/volunteers';
        } else if (mostRelevantPolicy.id === 'checkin' || mostRelevantPolicy.title.toLowerCase().includes('check')) {
          policyPath = '/policies/checkin';
        } else if (mostRelevantPolicy.id === 'safety' || mostRelevantPolicy.title.toLowerCase().includes('safety')) {
          policyPath = '/policies/safety';
        } else if (mostRelevantPolicy.id === 'training' || mostRelevantPolicy.title.toLowerCase().includes('training')) {
          policyPath = '/policies/training';
        }
      }
      
      return { answer, policyPath };
    } catch (error) {
      console.error('Error generating response with embedded model:', error);
      throw new Error('R.ai could not process your query. Please try again.');
    }
  }
  
  /**
   * Perform a basic keyword search on policies
   */
  basicSearch(query: string): Policy[] {
    if (!query.trim() || this.policyData.length === 0) {
      return this.policyData;
    }
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return this.policyData.filter(policy => {
      const titleMatch = policy.title.toLowerCase().includes(query.toLowerCase());
      const summaryMatch = policy.summary.toLowerCase().includes(query.toLowerCase());
      const contentMatch = policy.content.toLowerCase().includes(query.toLowerCase());
      
      // Check for matches with individual search terms
      const termMatches = searchTerms.some(term => {
        if (term.length < 3) return false; // Skip very short terms
        return (
          policy.title.toLowerCase().includes(term) || 
          policy.summary.toLowerCase().includes(term) || 
          policy.content.toLowerCase().includes(term) ||
          policy.category.toLowerCase().includes(term)
        );
      });
      
      return titleMatch || summaryMatch || contentMatch || termMatches;
    });
  }
}

// Export a singleton instance
const tinyLlamaSearch = new TinyLlamaSearchService();
export default tinyLlamaSearch;
