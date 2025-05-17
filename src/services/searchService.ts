import { pipeline } from '@xenova/transformers';
import { Policy } from '../data/policyData';

/**
 * Simple wrapper for R.ai search functionality
 */
class TinyLlamaSearchService {
  // Model loading status
  private loading: boolean = false;
  private loaded: boolean = false;
  private model: any = null;
  private policyData: Policy[] = [];
  
  /**
   * Initialize the R.ai model
   */
  async initModel() {
    if (this.loading || this.loaded) return;
    
    try {
      this.loading = true;
      console.log('Loading R.ai model...');
      
      // Use text-generation pipeline with TinyLlama model
      this.model = await pipeline(
        'text-generation',
        'Xenova/TinyLlama-1.1B-Chat-v1.0'
      );
      
      this.loaded = true;
      this.loading = false;
      console.log('R.ai model loaded successfully');
    } catch (error) {
      console.error('Failed to load TinyLlama model:', error);
      this.loading = false;
    }
  }
  
  /**
   * Generate improved search query with TinyLlama
   */
  async enhanceQuery(query: string): Promise<string> {
    if (!this.loaded && !this.loading) {
      await this.initModel();
    }
    
    if (!this.loaded) {
      console.log('TinyLlama not loaded, returning original query');
      return query;
    }
    
    try {
      // Prompt the model to generate a better search query
      const prompt = `Improve this search query for searching church policies: "${query}". 
Provide only the improved search query without any explanation.`;
      
      const result = await this.model(prompt, {
        max_new_tokens: 30,
        temperature: 0.3,
        top_p: 0.95,
      });
      
      // Extract the generated text without the prompt
      const generatedText = result[0].generated_text.replace(prompt, '').trim();
      
      // Clean up the response - remove quotes and other unnecessary characters
      const enhancedQuery = generatedText
        .replace(/^["']/, '') // Remove leading quotes
        .replace(/["']$/, '') // Remove trailing quotes
        .replace(/^Improved query: /, '') // Remove any prefix like 'Improved query:'
        .trim();
      
      console.log('Original query:', query);
      console.log('Enhanced query:', enhancedQuery);
      
      return enhancedQuery || query; // Fallback to original if something went wrong
    } catch (error) {
      console.error('Error enhancing search query:', error);
      return query; // Return original query if enhancement fails
    }
  }
  
  /**
   * Check if the model is loaded
   */
  isLoaded(): boolean {
    return this.loaded;
  }
  
  /**
   * Check if the model is currently loading
   */
  isLoading(): boolean {
    return this.loading;
  }
  
  /**
   * Set the policy data for search operations
   */
  setPolicyData(policies: Policy[]) {
    this.policyData = policies;
    console.log(`Set ${policies.length} policies for search`);
  }
  
  /**
   * Initialize TinyLlama model - alias for initModel with better naming
   */
  initializeModel() {
    return this.initModel();
  }
  
  /**
   * Perform semantic search using TinyLlama to find matching policies
   */
  async semanticSearch(query: string): Promise<Policy[]> {
    // First enhance the query with TinyLlama
    const enhancedQuery = await this.enhanceQuery(query);
    
    // Then use the enhanced query for basic search
    return this.basicSearch(enhancedQuery);
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
        return 
          policy.title.toLowerCase().includes(term) || 
          policy.summary.toLowerCase().includes(term) || 
          policy.content.toLowerCase().includes(term) ||
          policy.category.toLowerCase().includes(term);
      });
      
      return titleMatch || summaryMatch || contentMatch || termMatches;
    });
  }
}

// Export a singleton instance
const tinyLlamaSearch = new TinyLlamaSearchService();
export default tinyLlamaSearch;
