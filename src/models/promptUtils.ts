/**
 * Prompt utilities for TinyLlama
 * Contains functions to create effective prompts for policy questions
 */

import { Policy } from '../data/policyData';
import { generateText, initializeModel, isLoaded, isLoading } from './tinyLlama';

// Cache for the loaded prompt template
let promptTemplateCache: string | null = null;

/**
 * Load the prompt template from the markdown file
 * @returns The loaded prompt template as a string
 */
async function loadPromptTemplate(): Promise<string> {
  // Return cached version if available
  if (promptTemplateCache) {
    return promptTemplateCache;
  }
  
  try {
    // Fetch the prompt template from the public directory
    console.log('Loading prompt template from /prompts/policy-question.md');
    const response = await fetch('/prompts/policy-question.md');
    
    if (!response.ok) {
      throw new Error(`Failed to load prompt template: ${response.status} ${response.statusText}`);
    }
    
    // Store in cache and return
    const text = await response.text();
    console.log('Prompt template loaded, length:', text.length);
    promptTemplateCache = text;
    return promptTemplateCache;
  } catch (error) {
    console.error('Error loading prompt template:', error);
    
    // No fallbacks - rethrow the error
    console.error('Cannot continue without prompt template');
    throw error;
  }
}

/**
 * Create a well-formatted prompt for LLMs (Gemini or TinyLlama) to answer policy questions
 * @param query The user's question
 * @param policies Array of relevant policies to reference (primary policy first)
 * @returns A formatted prompt for the LLM
 */
export async function createPolicyQuestionPrompt(query: string, policies: Policy[]): Promise<string> {
  // Load the prompt template
  const template = await loadPromptTemplate();
  
  // Convert the template format to be compatible with any LLM
  // Remove special tokens that Gemini might interpret literally
  const cleanTemplate = template
    .replace(/<\|system\|>/g, 'SYSTEM:')
    .replace(/<\/\|system\|>/g, '')
    .replace(/<\|user\|>/g, 'USER:')
    .replace(/<\|assistant\|>/g, 'ASSISTANT:')
    .replace(/<\/\|user\|>/g, '')
    .replace(/<\/\|assistant\|>/g, '');
  
  // Prepare an efficient format for all policies
  // We'll use a compact representation to save tokens while preserving all content
  let allPolicyContent = '';
  
  // Add policy count to the title section
  const allPolicyTitles = `Policy Index (${policies.length} total)`;
  
  // Create a structured policy content section
  // Group by categories if possible to make the content more organized
  const categoryMap = new Map<string, Policy[]>();
  
  // First pass: organize policies by category if possible
  policies.forEach(policy => {
    // Try to extract a category from the policy title (before the first colon or dash)
    const categoryMatch = policy.title.match(/^([^:]+)[:\-]/);
    const category = categoryMatch ? categoryMatch[1].trim() : 'General Policies';
    
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(policy);
  });
  
  // Second pass: construct the content by category
  for (const [category, categoryPolicies] of categoryMap.entries()) {
    // Add category header
    allPolicyContent += `\n\n## ${category}\n`;
    
    // Add each policy in the category
    categoryPolicies.forEach(policy => {
      // Add the policy with a clear header
      allPolicyContent += `\n### ${policy.title}\n${policy.content.trim()}\n`;
    });
  }
  
  // Replace placeholders with combined policy content
  const systemPrompt = cleanTemplate
    .replace('{{POLICY_TITLE}}', allPolicyTitles.trim())
    .replace('{{POLICY_CONTENT}}', allPolicyContent.trim());
  
  // Format the user query in a way that works with any LLM
  const userPrompt = `USER: ${query.trim()}\nASSISTANT:`;
  
  // Combine system and user prompts
  return `${systemPrompt}\n${userPrompt}`;
}