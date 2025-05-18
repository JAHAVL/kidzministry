import { Policy } from '../data/policyData';
import { generateGeminiResponse, checkGeminiApiAvailability } from '../models/geminiService';
import { createPolicyQuestionPrompt } from '../models/promptUtils';
import rateLimiter from './rateLimiterService';

/**
 * Map of common policy sections by category - this ensures we can show relevant sections even if the LLM doesn't provide them
 * Each mapping accurately connects keyword to exact section name and correct policy ID
 */
const COMMON_POLICY_SECTIONS = {
  // Team guidelines (ID: team-guidelines)
  'schedule': [{ id: 'team-guidelines', section: 'Weekly Schedule' }],
  'arrival': [{ id: 'team-guidelines', section: 'Weekly Schedule' }],
  'time': [{ id: 'team-guidelines', section: 'Weekly Schedule' }],
  'huddle': [{ id: 'team-guidelines', section: 'Weekly Schedule' }],
  'serve': [{ id: 'team-guidelines', section: 'Service Responsibilities' }],
  'sit one': [{ id: 'team-guidelines', section: 'Sit One, Serve One Policy' }],
  'volunteer': [{ id: 'team-guidelines', section: 'Volunteer Requirements' }],
  'background': [{ id: 'team-guidelines', section: 'Volunteer Requirements' }],
  
  // Behavior Guidelines (ID: behavior-guidelines)
  'dress': [{ id: 'behavior-guidelines', section: 'Dress Code' }],
  'wear': [{ id: 'behavior-guidelines', section: 'Dress Code' }],
  'attire': [{ id: 'behavior-guidelines', section: 'Dress Code' }],
  'discipline': [{ id: 'behavior-guidelines', section: 'Discipline Policy' }],
  'behavior': [{ id: 'behavior-guidelines', section: 'Code of Conduct' }],
  'conduct': [{ id: 'behavior-guidelines', section: 'Code of Conduct' }],
  
  // Safety policies (ID: safety-policies)
  'check-in': [{ id: 'safety-policies', section: 'Check-In/Check-Out Procedures' }],
  'check out': [{ id: 'safety-policies', section: 'Check-In/Check-Out Procedures' }],
  'emergency': [{ id: 'safety-policies', section: 'Emergency Procedures' }],
  'accident': [{ id: 'safety-policies', section: 'Emergency Procedures' }],
  'evacuation': [{ id: 'safety-policies', section: 'Emergency Procedures' }],
  'health': [{ id: 'safety-policies', section: 'Health & Hygiene' }],
  'illness': [{ id: 'safety-policies', section: 'Health & Hygiene' }],
  
  // Communication (ID: communication-policies)
  'parent': [{ id: 'communication-policies', section: 'Parent Communication Policies' }],
  'communication': [{ id: 'communication-policies', section: 'Team Communication & Scheduling' }],
  'email': [{ id: 'communication-policies', section: 'Parent Communication Policies' }],
  'text': [{ id: 'communication-policies', section: 'Parent Communication Policies' }],
};

/**
 * Find relevant section headings based on query keywords
 * @param query The user's query
 * @returns Array of section headings with their policy IDs
 */
function findRelevantSections(query: string): Array<{id: string; section: string}> {
  const lowercaseQuery = query.toLowerCase();
  const relevantSections: Array<{id: string; section: string}> = [];
  
  // Look for keyword matches in the query
  Object.entries(COMMON_POLICY_SECTIONS).forEach(([keyword, sections]) => {
    if (lowercaseQuery.includes(keyword)) {
      sections.forEach(section => {
        // Avoid duplicates
        if (!relevantSections.some(s => s.id === section.id && s.section === section.section)) {
          relevantSections.push(section);
        }
      });
    }
  });
  
  // Return up to 3 relevant sections
  return relevantSections.slice(0, 3);
}

/**
 * Gemini API implementation for Redefine Church's Kidz Ministry
 * Uses the Google Gemini API for generating responses
 */
class KidzMinistrySearchService {
  private policyData: Policy[] = [];
  private isInitialized: boolean = false;
  private useFallbackMode: boolean = false;
  private isApiAvailable: boolean = true;
  private lastForcedPolicyId: string | null = null; // Track policy IDs that should override metadata

  /**
   * Initialize the Gemini API service
   */
  async initModel(): Promise<boolean> {
    if (this.isInitialized) return true;
    
    console.log('Initializing Gemini API service...');
    try {
      // Check if the Gemini API is available and working
      const isAvailable = await checkGeminiApiAvailability();
      
      this.isApiAvailable = isAvailable;
      this.useFallbackMode = !isAvailable;
      this.isInitialized = true;
      
      if (isAvailable) {
        console.log('✅ Gemini API service ready!');
      } else {
        console.log('⚠️ Gemini API unavailable, switching to basic search fallback mode');
      }
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Gemini API service:', error);
      // Switch to fallback mode instead of failing
      this.useFallbackMode = true;
      this.isApiAvailable = false;
      this.isInitialized = true; // Consider initialized but in fallback mode
      console.log('⚠️ Switching to basic search fallback mode');
      return true; // Return true so the app continues working
    }
  }
  
  /**
   * Check if the API service is ready
   */
  isLoaded(): boolean {
    return this.isInitialized && this.isApiAvailable;
  }
  
  /**
   * Check if the API service is currently initializing
   */
  isLoading(): boolean {
    return !this.isInitialized;
  }
  
  /**
   * Check if we're using fallback mode (basic search instead of AI)
   */
  isUsingFallback(): boolean {
    return this.useFallbackMode;
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
   * Find matching policies using basic keyword search
   * @param query User's search query
   * @returns Array of matching policies
   */
  async semanticSearch(query: string): Promise<Policy[]> {
    console.log('Finding relevant policies...');
    if (!query.trim() || this.policyData.length === 0) {
      return [];
    }
    
    // Simply use the basic search function since we'll pass full policy content to TinyLlama
    return this.basicSearch(query);
  }
  
  /**
   * Enhanced basic search functionality with better relevance scoring
   * @param query Search query
   * @returns Array of matching policies
   */
  private basicSearch(query: string): Policy[] {
    if (!query.trim() || this.policyData.length === 0) {
      return [];
    }
    
    // Normalize and split the search query
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length >= 2);
    if (searchTerms.length === 0) return [];
    
    // Create common variations of terms to improve matching
    const expandedTerms = this.expandSearchTerms(searchTerms);
    
    // Score each policy based on relevance to search terms
    const scoredPolicies = this.policyData.map(policy => {
      let score = 0;
      const policyText = `${policy.title} ${policy.summary || ''} ${policy.content}`.toLowerCase();
      
      // Check for exact phrase match first (highest relevance)
      if (policyText.includes(query.toLowerCase())) {
        score += 100;
      }
      
      // Check for individual term matches
      for (const term of expandedTerms) {
        if (policyText.includes(term)) {
          // Weight matches in title and summary more heavily
          if (policy.title.toLowerCase().includes(term)) {
            score += 10;
          } else if (policy.summary && policy.summary.toLowerCase().includes(term)) {
            score += 5;
          } else {
            score += 1;
          }
        }
      }
      
      return { policy, score };
    });
    
    // Filter policies with non-zero scores and sort by descending score
    return scoredPolicies
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.policy);
  }
  
  /**
   * Expand search terms to include common variations
   * This improves search quality for related terms
   */
  private expandSearchTerms(terms: string[]): string[] {
    const expanded = new Set<string>();
    
    // Add original terms
    terms.forEach(term => expanded.add(term));
    
    // Add common variations and related terms
    terms.forEach(term => {
      // Time-related terms
      if (['time', 'schedule', 'hour'].includes(term)) {
        expanded.add('worship');
        expanded.add('service');
        expanded.add('experience');
        expanded.add('am');
        expanded.add('pm');
        expanded.add('sunday');
      }
      
      // Check-in related terms
      if (['checkin', 'check-in', 'check'].includes(term)) {
        expanded.add('kiosk');
        expanded.add('register');
        expanded.add('app');
      }
      
      // Safety related terms
      if (['safe', 'safety', 'secure', 'security'].includes(term)) {
        expanded.add('emergency');
        expanded.add('protocol');
        expanded.add('procedure');
      }
    });
    
    return Array.from(expanded);
  }
  
  /**
   * Generate a response to a user query using the LLM
   * @param query User query
   * @returns Object with answer text, primary policy ID, and related policy info including section names
   */
  async generateResponse(query: string): Promise<{ 
    answer: string; 
    policyId: string; 
    relatedPolicyIds: string[];
    relatedPolicySections?: Array<{id: string; section: string}>;
  }> {
    console.log(`Generating response for query: "${query}"`);
    
    // Reset forced policy ID at the start of each new query
    this.lastForcedPolicyId = null;
    
    if (!query.trim()) {
      return {
        answer: 'Please enter a question about our policies.',
        policyId: '',
        relatedPolicyIds: []
      };
    }

    try {
      // Check rate limits before proceeding
      const rateCheck = rateLimiter.canMakeRequest();
      if (!rateCheck.allowed) {
        const waitTimeSeconds = Math.ceil((rateCheck.waitTime || 0) / 1000);
        
        // If daily limit is reached
        if (rateCheck.reason?.includes('Daily query limit')) {
          throw new Error(
            `You've reached your daily limit of queries. Please try again tomorrow. ` +
            `This helps us ensure everyone has access to the policies.`
          );
        }
        
        // If it's just the short-term rate limit
        throw new Error(
          `Please wait ${waitTimeSeconds} seconds before making another query. ` +
          `This helps keep our AI service responsive for everyone.`
        );
      }

      // Ensure the API service is initialized
      if (!this.isInitialized) {
        console.log('Initializing Gemini API service...');
        const initialized = await this.initModel();
        if (!initialized) {
          throw new Error('Failed to initialize the AI service');
        }
      }

      // Check if we need to use our fallback mode
      if (this.useFallbackMode) {
        console.log('Using fallback mode for response');
        return this.generateBasicResponse(query);
      }
      
      // Always find relevant sections based on keywords in the query
      // This ensures we have meaningful sections even if the LLM doesn't provide good metadata
      const keywordBasedSections = findRelevantSections(query);
      console.log('Keyword-based section matches:', keywordBasedSections);

      // Find relevant policies to use as fallback if metadata isn't provided
      const relevantPolicies = await this.semanticSearch(query);
      
      if (this.policyData.length === 0) {
        // No policies loaded, can't generate a response
        return {
          answer: `I couldn't find any policies in our system. Please try again later.`,
          policyId: '',
          relatedPolicyIds: []
        };
      }
      
      // Default values for navigation (will be overridden by metadata if available)
      // Variables to track the most relevant policy and related policies
      let primaryPolicyId = '';
      let relatedPolicyIds: string[] = [];
      let relatedPolicySections: Array<{id: string; section: string}> = [];
      
      // IMPORTANT: Create a prompt with the exact query and ALL policies
      // This ensures the LLM has complete information and the query is not modified
      console.log(`Preparing prompt with exact query: "${query}" and all ${this.policyData.length} policies`);
      const prompt = await createPolicyQuestionPrompt(query, this.policyData);
      
      // Generate response using Gemini API
      console.log('Generating response with Gemini API...');
      const response = await generateGeminiResponse(prompt);
      
      // Record the successful API call for rate limiting
      rateLimiter.recordRequest();
      
      // Helper function to detect Bible-related questions
      const isBibleQuestion = (text: string): boolean => {
        const bibleKeywords = [
          'bible', 'scripture', 'gospel', 'jesus', 'christ', 'god', 'holy spirit',
          'salvation', 'baptism', 'sin', 'faith', 'grace', 'heaven', 'hell',
          'pray', 'worship', 'church', 'disciple', 'testament', 'verse', 'psalm',
          'proverb', 'genesis', 'exodus', 'matthew', 'mark', 'luke', 'john',
          'revelation', 'apostle', 'prophet', 'theology', 'doctrine', 'biblical',
          'spiritual', 'christian', 'christianity', 'trinity', 'commandment'
        ];
        
        // Check if query contains Bible-related keywords
        const lowerText = text.toLowerCase();
        return bibleKeywords.some(keyword => lowerText.includes(keyword));
      };

      // Helper function to detect dress code related questions
      const isDressCodeQuestion = (text: string): boolean => {
        const dressCodeKeywords = [
          'dress code', 'dress', 'clothing', 'attire', 'outfit', 'wear', 'wardrobe',
          'uniform', 'appearance', 'shirt', 'pants', 'shoes', 'shorts', 'skirt',
          'modest', 'modesty', 'appropriate', 'inappropriate', 'acceptable', 'unacceptable'
        ];
        
        const lowerText = text.toLowerCase();
        return dressCodeKeywords.some(keyword => lowerText.includes(keyword));
      };

      // Check if this is a Bible-related question
      const isBibleRelated = isBibleQuestion(query) || isBibleQuestion(response.text);
      
      // Check if this is a dress code related question - check original query to be extra safe
      const isDressCode = isDressCodeQuestion(query) || isDressCodeQuestion(response.text);
      
      // For dress code questions, set the primaryPolicyId to behavior guidelines - this takes absolute priority
      if (isDressCode) {
        console.log('Dress code question detected, directing to Behavior Guidelines');
        primaryPolicyId = 'behavior-guidelines-and-discipline';
        
        // Store this forced policy ID as a flag to prevent metadata from overriding it
        this.lastForcedPolicyId = 'behavior-guidelines-and-discipline';
      }
      // For Bible questions, set the primaryPolicyId to vision page - but only if not dress code related
      else if (isBibleRelated) {
        console.log('Bible-related question detected, directing to Vision page');
        primaryPolicyId = 'movement-vision';
        
        // Store this forced policy ID as a flag to prevent metadata from overriding it
        this.lastForcedPolicyId = 'movement-vision';
      }
      
      // Process metadata if available to find the right policy and related sections
      if (response.metadata) {
        console.log('Metadata received from LLM:', response.metadata);
        const { primaryPolicy } = response.metadata;
        let relatedPolicies = response.metadata.relatedPolicies || [];
        
        // Only use metadata if we haven't forced a specific policy ID for dress code or Bible questions
        if (!this.lastForcedPolicyId) {
          // Find policy by title match for primary navigation
          // The primaryPolicy should be a main policy title like "2. Team Guidelines"
          if (primaryPolicy) {
            const matchingPolicy = this.policyData.find(p => 
              p.title.toLowerCase() === primaryPolicy.toLowerCase());
            
            if (matchingPolicy) {
              primaryPolicyId = matchingPolicy.id;
              console.log(`Using primary policy from metadata: ${matchingPolicy.title} (${primaryPolicyId})`);
            }
          }
        } else {
          console.log(`Preserving forced policy ID: ${this.lastForcedPolicyId} - ignoring metadata`);
        }
        
        // Process related policy sections - if relatedPolicies is empty or undefined, extract important headings from response text
        if (!relatedPolicies || relatedPolicies.length === 0) {
          console.log('No relatedPolicies from LLM metadata, attempting to extract from answer text');
          
          // Extract potential headings from the response text
          const lines = response.text.split('\n');
          const potentialHeadings: string[] = [];
          
          lines.forEach(line => {
            // Look for likely headings: short lines with no punctuation at the end 
            // that don't start with common text patterns
            const trimmedLine = line.trim();
            if (trimmedLine && 
                trimmedLine.length < 50 && 
                !trimmedLine.match(/[.,:;!?]$/) && 
                !trimmedLine.match(/^(I|You|We|They|The|If|For|When|Please|Note)/i)) {
              potentialHeadings.push(trimmedLine);
            }
          });
          
          console.log('Potential headings extracted from text:', potentialHeadings);
          relatedPolicies = potentialHeadings.slice(0, 3);
        }
      
        console.log('Raw relatedPolicies to process:', relatedPolicies);
        if (relatedPolicies && relatedPolicies.length > 0) {
        // For each section heading in relatedPolicies, try to find matching content
        // These should be section headings like "Weekly Schedule" or "Service Responsibilities"
        const sectionMatches: Array<{id: string; title: string; matchedSection: string; matchType: string}> = [];
        
        // Search through all policies for the section headings
        this.policyData.forEach(policy => {
          // First, split the policy content by newlines to get individual lines
          const contentLines = policy.content.split('\n');
          
          relatedPolicies.forEach(section => {
            // Try exact match first - look for the section heading exactly as it appears
            const exactMatch = contentLines.some(line => line.trim() === section.trim());
            
            if (exactMatch) {
              console.log(`✅ EXACT match for section "${section}" in policy "${policy.title}"`);
              sectionMatches.push({
                id: policy.id,
                title: policy.title,
                matchedSection: section,
                matchType: 'exact'
              });
            } 
            // Then try partial match if we didn't find an exact match
            else if (policy.content.includes(section)) {
              console.log(`⚠️ PARTIAL match for section "${section}" in policy "${policy.title}"`);
              sectionMatches.push({
                id: policy.id,
                title: policy.title,
                matchedSection: section,
                matchType: 'partial'
              });
            }
          });
        });
        
        console.log('Section matches found:', sectionMatches);
        
        // If we found section matches, use them for related policies
        if (sectionMatches.length > 0) {
          // First filter out duplicates and the primary policy
          let uniqueMatches = sectionMatches
            .filter((match, index, self) => 
              index === self.findIndex(m => m.id === match.id && m.matchedSection === match.matchedSection)
            )
            .filter(match => match.id !== primaryPolicyId);
            
          console.log('Unique section matches:', uniqueMatches);
          
          // Prioritize exact matches first
          const exactMatches = uniqueMatches.filter(match => match.matchType === 'exact');
          console.log('Exact matches:', exactMatches.length);
          
          // If we have exact matches, use only those
          if (exactMatches.length > 0) {
            uniqueMatches = exactMatches;
            console.log('Using only exact matches for related sections');
          }
          
          // Get just the IDs, limited to 3
          const limitedMatches = uniqueMatches.slice(0, 3);
          
          // Store both IDs and section names
          relatedPolicyIds = limitedMatches.map(match => match.id);
          relatedPolicySections = limitedMatches.map(match => ({
            id: match.id,
            section: match.matchedSection
          }));
          
          console.log('Final related policy sections:', relatedPolicySections);
          console.log(`Found ${relatedPolicyIds.length} policies with matching section headings`);
          } else {
            // If no exact matches, try a broader search
            console.log('No exact section matches, trying broader search');
            
            // Try to find policies containing text similar to the section headings
            const sectionPolicies = this.policyData.filter(policy => 
              relatedPolicies.some(section => 
                policy.content.toLowerCase().includes(section.toLowerCase())
              )
            );
            
            relatedPolicyIds = sectionPolicies
              .filter(p => p.id !== primaryPolicyId)
              .slice(0, 3)
              .map(p => p.id);
              
            console.log(`Found ${relatedPolicyIds.length} policies with related content`);
          }
        }
      } else {
        // No metadata available, fall back to relevance-based approach
        console.log('No metadata in response, using relevance-based navigation');
        relatedPolicyIds = relevantPolicies
          .filter(p => p.id !== primaryPolicyId)
          .slice(0, 3) // Take up to 3 related policies (excluding most relevant)
          .map(p => p.id);
      }
      
      // If no good sections were found through metadata, use our keyword-based approach
      if (!relatedPolicySections || relatedPolicySections.length === 0) {
        console.log('Using keyword-based sections as fallback');
        relatedPolicySections = keywordBasedSections;
        // Update related IDs to match our keyword sections
        if (keywordBasedSections.length > 0) {
          relatedPolicyIds = [...new Set(keywordBasedSections.map(section => section.id))];
        }
      }
      
      return { 
        answer: response.text, 
        policyId: primaryPolicyId,
        relatedPolicyIds,
        relatedPolicySections
      };
    } catch (error) {
      console.error('Error in generateResponse:', error);
      
      // If AI fails, fall back to the basic response
      return this.generateBasicResponse(query);
    }
  }
  
  /**
   * Generate a basic response without using AI
   * Used as fallback when AI is unavailable
   */
  private async generateBasicResponse(query: string): Promise<{ 
    answer: string; 
    policyId: string;
    relatedPolicyIds: string[];
    relatedPolicySections: Array<{id: string; section: string}>;
  }> {
    try {
      // Find relevant policies using basic keyword search
      const relevantPolicies = this.basicSearch(query);
      
      // If no relevant policies found, return a default message
      if (relevantPolicies.length === 0) {
        return {
          answer: `I couldn't find information about "${query}" in our policies. Please browse our policies directly.`,
          policyId: '',
          relatedPolicyIds: [],
          relatedPolicySections: []
        };
      }
      
      // Get the most relevant policy
      const mostRelevantPolicy = relevantPolicies[0];
      
      // Get related policies (up to 3)
      const relatedPolicies = relevantPolicies.slice(1, 4);
      const relatedPolicyIds = relatedPolicies.map((policy: Policy) => policy.id);
      
      // Create section names for each related policy (just use the policy title without numbering for now)
      const relatedPolicySections = relatedPolicyIds.map((id: string, index: number) => ({
        id,
        section: relatedPolicies[index].title.replace(/^\d+\.\s*/, '') // Remove numbering if present
      }));
      
      // In fallback mode, combine information from multiple policies to create a more comprehensive answer
      let combinedInfo = '';
      // Include up to 3 policies to avoid very long responses
      const policiesToInclude = relevantPolicies.slice(0, 3);
      
      policiesToInclude.forEach((policy: Policy, index: number) => {
        combinedInfo += `${index > 0 ? '\n\n' : ''}${policy.title}:\n${policy.summary || 'Please refer to the full policy for details.'}`;
      });
      
      // Create a simple response using the combined policy information
      const answer = `Based on our policies, I found this information about "${query}":\n\n${combinedInfo}\n\nYou can view the complete policies for more details.`;
      
      return {
        answer,
        policyId: mostRelevantPolicy.id,
        relatedPolicyIds,
        relatedPolicySections
      };
    } catch (error) {
      console.error('Error in generateBasicResponse:', error);
      return {
        answer: 'I encountered an error while searching. Please browse our policies directly.',
        policyId: '',
        relatedPolicyIds: [],
        relatedPolicySections: []
      };
    }
  }
  
  // Note: We've removed the getPolicyPath method as we now use direct policy IDs instead of paths
}

// Export a singleton instance
const searchService = new KidzMinistrySearchService();
export default searchService;
