/**
 * TinyLlama implementation using Transformers.js
 * This file handles loading and running the TinyLlama model in the browser
 */

import { env, pipeline } from '@xenova/transformers';

// Configuration
// Using Tiny Llama from Hugging Face directly instead of local files
// This lets transformers.js handle downloading & caching model files
const REMOTE_MODEL_ID = 'Xenova/TinyLlama-1.1B-Chat-v1.0';

// Enable caching to improve load times after first use
env.useBrowserCache = true;
env.cacheDir = './transformers_cache';

// Status tracking
let isModelLoading = false;
let isModelLoaded = false;
let modelInstance: any = null;
let modelError: Error | null = null;

// Default generation parameters
const DEFAULT_GENERATION_PARAMS = {
  max_new_tokens: 512,      // Increased context for more complete responses
  temperature: 0.7,         // Balanced creativity (0.0-1.0)
  top_p: 0.9,              // Nucleus sampling
  top_k: 50,                // Limit to top-k most likely tokens
  repetition_penalty: 1.1,   // Slight penalty for repetition
  do_sample: true,          // Enable sampling
  return_full_text: false,   // Don't include the prompt in the output
};

/**
 * Generate text using the TinyLlama model
 * @param prompt The prompt to send to the model
 * @param params Optional generation parameters
 * @returns Generated text response
 */
export async function generateText(
  prompt: string, 
  params: Partial<typeof DEFAULT_GENERATION_PARAMS> = {}
): Promise<string> {
  if (!prompt?.trim()) {
    throw new Error('Prompt cannot be empty');
  }

  try {
    // Initialize the model if not already loaded
    if (!modelInstance && !isModelLoading) {
      await initializeModel();
    }

    // If model is still not loaded after initialization attempt
    if (!modelInstance) {
      if (modelError) throw modelError;
      throw new Error('Model failed to initialize');
    }
    
    // Generate text from the model using the prompt with merged parameters
    const generationParams = { ...DEFAULT_GENERATION_PARAMS, ...params };
    const output = await modelInstance(prompt, generationParams);
    
    // Extract and clean the generated text
    const generatedText = output?.[0]?.generated_text || '';
    return generatedText.trim();
  } catch (error) {
    console.error('Error generating text with TinyLlama:', error);
    throw new Error(`Failed to generate text: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Initialize the TinyLlama model
 * This loads the model using the Transformers.js pipeline
 */
export async function initializeModel(): Promise<void> {
  if (isModelLoaded) return;
  if (isModelLoading) {
    // If already loading, wait for it to complete
    return new Promise((resolve) => {
      const checkLoaded = () => {
        if (isModelLoaded || modelError) {
          clearInterval(interval);
          resolve();
        }
      };
      const interval = setInterval(checkLoaded, 100);
    });
  }
  
  isModelLoading = true;
  modelError = null;
  
  try {
    console.log('🚀 Initializing TinyLlama model...');
    
    // Create a text generation pipeline with the remote TinyLlama model
    modelInstance = await pipeline('text-generation', REMOTE_MODEL_ID, {
      quantized: true,  // Use quantized model for better performance
      progress_callback: (progress: any) => {
        console.log(`Loading progress: ${Math.round(progress.loaded / progress.total * 100)}%`);
      },
    });
    
    isModelLoaded = true;
    console.log('✅ TinyLlama model loaded successfully!');
  } catch (error) {
    const errorMessage = `Failed to load TinyLlama model: ${error instanceof Error ? error.message : String(error)}`;
    console.error(errorMessage, error);
    modelError = new Error(errorMessage);
    throw modelError;
  } finally {
    isModelLoading = false;
  }
}

/**
 * Check if the model is currently loading
 */
export function isLoading(): boolean {
  return isModelLoading;
}

/**
 * Check if the model has been loaded
 */
export function isLoaded(): boolean {
  return isModelLoaded;
}

/**
 * Get the current model loading error, if any
 */
export function getModelError(): Error | null {
  return modelError;
}

/**
 * Reset the model instance
 * Useful for cleanup or when you need to reload the model
 */
export async function resetModel(): Promise<void> {
  if (modelInstance) {
    try {
      await modelInstance.dispose?.();
    } catch (error) {
      console.error('Error disposing model:', error);
    }
    modelInstance = null;
  }
  isModelLoaded = false;
  isModelLoading = false;
  modelError = null;
}
