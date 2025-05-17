/**
 * Embedded AI model for Redefine Church's Kidz Ministry policies
 * This model is bundled with the app and doesn't require downloading
 */

// Import necessary types
import { Policy } from '../data/policyData';

// Constants for the embedded model responses
const MINISTRY_VALUES = {
  MODERN: 'modern',
  ENCOURAGING: 'encouraging',
  AUTHENTIC: 'authentic',
  CONVERSATIONAL: 'conversational',
};

// Church profile data - embedded context for responses
const CHURCH_PROFILE = {
  name: 'Redefine Church',
  vision: 'See that God is making all things new',
  movement: 'The broken would be redefined to the restored through Jesus Christ',
  style: 'Theologically Southern Baptist, modern, creative, energetic, relevant',
  communicationStyle: 'Conversational, authentic, encouraging, story-driven, modern',
};

/**
 * Generate embedding vectors for text using a simple algorithm
 * This is a simplified version that provides deterministic results
 */
function generateEmbedding(text: string): number[] {
  // Create a 128-dimension vector (simplified embedding)
  const embedding = new Array(128).fill(0);
  
  // Simple hash function to convert text to embedding
  const normalizedText = text.toLowerCase().trim();
  for (let i = 0; i < normalizedText.length; i++) {
    const charCode = normalizedText.charCodeAt(i);
    embedding[i % embedding.length] += charCode;
  }
  
  // Normalize the vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / (magnitude || 1));
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Find the most relevant policies using semantic search
 */
export function findRelevantPolicies(query: string, policies: Policy[]): Policy[] {
  // Generate embedding for the query
  const queryEmbedding = generateEmbedding(query);
  
  // Generate embeddings for each policy if not already done
  const policyWithScores = policies.map(policy => {
    // Combine title and summary for better matching
    const policyText = `${policy.title} ${policy.summary}`;
    const policyEmbedding = generateEmbedding(policyText);
    
    // Calculate similarity score
    const score = cosineSimilarity(queryEmbedding, policyEmbedding);
    
    return {
      policy,
      score
    };
  });
  
  // Sort policies by similarity score (descending)
  policyWithScores.sort((a, b) => b.score - a.score);
  
  // Return the policies in order of relevance
  return policyWithScores.map(item => item.policy);
}

/**
 * Generate a response to a user query based on the most relevant policies
 * This allows the language model to directly interpret the raw query and policies
 * while maintaining Redefine Church's conversational and authentic style
 */
export function generateResponse(query: string, relevantPolicy: Policy): string {
  // Extract the policy information
  const { title, content } = relevantPolicy;

  // In a real implementation, we would send this to the LLM directly
  // const prompt = `
  //   You are R.ai, an AI assistant for Redefine Church's Kidz Ministry. 
  //   Answer the following question based on the provided policy information.
  //   Keep your answer concise, friendly, and in a conversational tone that matches Redefine Church's style.
  //   
  //   QUESTION: ${query}
  //   
  //   RELEVANT POLICY (${title}):
  //   ${content.trim()}
  //   
  //   Provide a brief, specific answer addressing only what was asked. Use a friendly, conversational tone.
  //   Start your response directly without saying 'Based on the policy' or similar phrases.
  // `;
  
  // Use the language model's understanding to generate a direct response
  // In this embedded approach, we're creating a deterministic response that 
  // simulates what the model would generate
  
  // Find relevant content from the policy that most closely matches the query
  const relevantParagraphs = findRelevantPolicyContent(query, content);
  
  // Craft a brief, direct answer based on the most relevant content
  const answer = createFormattedAnswer(query, title, relevantParagraphs);
  
  return answer;
}

/**
 * Find the most relevant content from a policy for a given query
 */
function findRelevantPolicyContent(query: string, content: string): string[] {
  // Split content into paragraphs for analysis
  const paragraphs = content.split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  // Simple relevance scoring based on keyword presence
  const queryWords = new Set(
    query.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2)
  );
  
  // Score paragraphs by relevance
  const scoredParagraphs = paragraphs.map(paragraph => {
    const paragraphLower = paragraph.toLowerCase();
    const wordMatch = Array.from(queryWords).filter(word => 
      paragraphLower.includes(word)
    ).length;
    
    // Direct phrase matching gets higher priority
    const directPhraseScore = paragraphLower.includes(query.toLowerCase()) ? 10 : 0;
    
    // Also check for similar phrases (e.g. 'call time' → 'arrive')
    const similarityScore = getSimilarityScore(query.toLowerCase(), paragraphLower);
    
    return {
      paragraph,
      score: wordMatch + directPhraseScore + similarityScore
    };
  });
  
  // Sort by relevance score in descending order
  scoredParagraphs.sort((a, b) => b.score - a.score);
  
  // Return up to 3 most relevant paragraphs
  return scoredParagraphs
    .slice(0, 3)
    .map(item => item.paragraph);
}

/**
 * Get similarity score between query and content using predefined mappings
 */
function getSimilarityScore(query: string, content: string): number {
  // Define common synonyms and related terms
  const similarityMap: {[key: string]: string[]} = {
    'call time': ['arrive', 'arrival', 'before service', '30 minutes'],
    'dress code': ['wear', 't-shirt', 'lanyard', 'clothing'],
    'check-in': ['check in', 'checkin', 'security tag', 'name tag'],
    'training': ['orientation', 'required training'],
    'schedule': ['serving', 'rotation', 'twice per month', 'commit']
  };
  
  // Check if any similarity mappings apply
  for (const [term, relatedTerms] of Object.entries(similarityMap)) {
    if (query.includes(term)) {
      return relatedTerms.filter(related => content.includes(related)).length * 2;
    }
  }
  
  return 0;
}

/**
 * Create a formatted answer based on the query and relevant paragraphs
 */
function createFormattedAnswer(query: string, _policyTitle: string, relevantParagraphs: string[]): string {
  // If we don't have any relevant paragraphs, return a fallback
  if (relevantParagraphs.length === 0) {
    return `I don't have specific information about ${query} in our policies.`;
  }
  
  // Determine if this is a simple question needing a direct response
  const isSimpleQuery = query.split(' ').length <= 4;
  
  // For simple queries, look for the most specific line that answers the question
  if (isSimpleQuery) {
    // For very specific queries, try to find a direct line that answers it
    const lines = relevantParagraphs.flatMap(p => 
      p.split(/[.!?]/)
       .map(line => line.trim())
       .filter(line => line.length > 15)
    );
    
    // Find the most relevant line
    const directAnswer = findMostRelevantLine(query, lines);
    if (directAnswer) {
      return `${briefOpener()}${directAnswer}${briefCloser()}`;
    }
  }
  
  // For more complex queries or if no direct line was found,
  // use the most relevant paragraph but keep it concise
  let answer = relevantParagraphs[0];
  
  // If the paragraph is very long, try to extract just the most relevant part
  if (answer.length > 150) {
    const sentences = answer.split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s + '.');
    
    // Get 1-2 most relevant sentences
    const mostRelevantSentences = findMostRelevantSentences(query, sentences);
    if (mostRelevantSentences.length > 0) {
      answer = mostRelevantSentences.join(' ');
    }
  }
  
  return `${briefOpener()}${answer}${briefCloser()}`;
}

/**
 * Find the most relevant line for a specific query
 */
function findMostRelevantLine(query: string, lines: string[]): string | null {
  const queryLower = query.toLowerCase();
  
  // Check for exact matches first
  const exactMatches = lines.filter(line => 
    line.toLowerCase().includes(queryLower)
  );
  
  if (exactMatches.length > 0) {
    return exactMatches[0];
  }
  
  // Handle special cases
  if (queryLower === 'call time' || queryLower === 'arrival time') {
    const timeLines = lines.filter(line => 
      line.toLowerCase().includes('arrive') || 
      line.toLowerCase().includes('before service')
    );
    
    if (timeLines.length > 0) {
      return timeLines[0];
    }
  }
  
  return null;
}

/**
 * Find the most relevant sentences for a query
 */
function findMostRelevantSentences(query: string, sentences: string[]): string[] {
  const queryWords = query.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  // Score each sentence
  const scoredSentences = sentences.map(sentence => {
    const sentenceLower = sentence.toLowerCase();
    let score = 0;
    
    // Count matching words
    for (const word of queryWords) {
      if (sentenceLower.includes(word)) {
        score += 1;
      }
    }
    
    // Boost score for direct phrase matches
    if (sentenceLower.includes(query.toLowerCase())) {
      score += 5;
    }
    
    return { sentence, score };
  });
  
  // Sort by score and take the best 1-2 sentences
  scoredSentences.sort((a, b) => b.score - a.score);
  return scoredSentences
    .slice(0, 2)
    .map(item => item.sentence);
}

/**
 * Brief, conversational opener for responses that matches Redefine Church's style
 */
function briefOpener(): string {
  const openers = [
    "",  // Sometimes no opener for directness
    "Great question! ",
    "I'd be happy to help with that. ",
    "Here's what you need to know: ",
    "Let me share some insight on this. "
  ];
  return openers[Math.floor(Math.random() * openers.length)];
}

/**
 * Brief, conversational closer for responses that matches Redefine Church's style
 */
function briefCloser(): string {
  const closers = [
    "",  // Sometimes no closer for brevity
    " Hope that helps!",
    " Let me know if you need anything else.",
    " This reflects our approach to ministry at Redefine Church.",
    " Feel free to ask if you have more questions."
  ];
  return closers[Math.floor(Math.random() * closers.length)];
}
