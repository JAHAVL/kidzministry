/**
 * Gemini API integration for Redefine Church's Kidz Ministry App
 * Uses Google's Gemini API to generate responses for policy questions
 */

// Environment variables for Gemini API
const GEMINI_API_KEY = 'AIzaSyBJsReOy2h_qiYAB2r3PdIZsB4SPY7G98g';
const MODEL_NAME = 'gemini-1.5-flash-latest';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Generate a response using the Gemini API
 * @param prompt The prompt to send to Gemini
 * @returns The generated text response and metadata
 */
export async function generateGeminiResponse(prompt: string): Promise<{ text: string; metadata: ResponseMetadata | null }> {
  if (!prompt?.trim()) {
    throw new Error('Prompt cannot be empty');
  }

  try {
    console.log('Sending request to Gemini API...');
    console.log('Prompt preview:', prompt.substring(0, 100) + '...');
    
    // Parse the prompt to extract the system message and user query
    // This helps structure the prompt in a way that Gemini can better understand
    const { systemMessage, userQuery } = parsePrompt(prompt);
    
    // Construct the API URL
    const url = `${GEMINI_API_URL}/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;
    
    // Prepare the request body with structured prompt parts
    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            { 
              text: `${systemMessage}\n\nQuestion: ${userQuery}` 
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
    
    // Make the API request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Extract the generated text
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    console.log('Gemini response received');
    console.log('Response preview:', generatedText.substring(0, 100) + '...');
    
    // Extract the response text and metadata
    const result = extractResponseAndMetadata(generatedText);
    console.log('Metadata extracted:', result.metadata ? 'Yes' : 'No');
    if (result.metadata) {
      console.log('Primary policy:', result.metadata.primaryPolicy);
      console.log('Related policies:', result.metadata.relatedPolicies);
    }
    
    return result;
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    throw new Error(`Failed to generate text with Gemini: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Parse the prompt to extract system message and user query
 * This helps structure the input for Gemini API
 */
function parsePrompt(prompt: string): { systemMessage: string; userQuery: string } {
  // Default values
  let systemMessage = '';
  let userQuery = '';
  
  // Try to extract system message and user query from the prompt
  const systemMatch = prompt.match(/SYSTEM:([\s\S]*?)(?=USER:|$)/i);
  const userMatch = prompt.match(/USER:([\s\S]*?)(?=ASSISTANT:|$)/i);
  
  if (systemMatch && systemMatch[1]) {
    systemMessage = systemMatch[1].trim();
  }
  
  if (userMatch && userMatch[1]) {
    // Use the raw query exactly as provided by the user
    userQuery = userMatch[1].trim();
  } else {
    // If no user query found, treat the whole prompt as the query
    userQuery = prompt.trim();
  }
  
  return { systemMessage, userQuery };
}

/**
 * Response metadata structure from LLM
 */
export interface ResponseMetadata {
  primaryPolicy: string;
  relatedPolicies: string[];
}

/**
 * Clean the response and extract any metadata
 * @param response Raw response from Gemini API
 * @returns Cleaned response text and any metadata found
 */
function extractResponseAndMetadata(response: string): { text: string; metadata: ResponseMetadata | null } {
  // Default metadata
  const defaultMetadata: ResponseMetadata = {
    primaryPolicy: '',
    relatedPolicies: []
  };
  
  // Clean the response
  let cleanedResponse = response
    .replace(/<\|assistant\|>/g, '')
    .replace(/<\/\|assistant\|>/g, '')
    .replace(/ASSISTANT:\s*/g, '')
    .trim();
  
  // Look for JSON metadata in the response (between ```json and ``` tags)
  const metadataMatch = cleanedResponse.match(/```json\s*([\s\S]*?)\s*```/);
  
  if (metadataMatch && metadataMatch[1]) {
    try {
      // Extract and parse the JSON metadata
      const metadataJson = metadataMatch[1];
      const metadata = JSON.parse(metadataJson);
      
      // Remove the metadata section from the response
      cleanedResponse = cleanedResponse.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
      
      return {
        text: cleanedResponse,
        metadata: {
          primaryPolicy: metadata.primaryPolicy || defaultMetadata.primaryPolicy,
          relatedPolicies: Array.isArray(metadata.relatedPolicies) ? metadata.relatedPolicies : defaultMetadata.relatedPolicies
        }
      };
    } catch (error) {
      console.error('Error parsing metadata JSON:', error);
    }
  }
  
  // If no metadata found or parsing failed, return just the cleaned response
  return {
    text: cleanedResponse,
    metadata: {
      primaryPolicy: '',
      relatedPolicies: []
    }
  };
}

/**
 * Check if the Gemini API is available and the API key is valid
 * @returns True if the API is available, false otherwise
 */
export async function checkGeminiApiAvailability(): Promise<boolean> {
  try {
    // Simple test prompt
    const testPrompt = "Hello, are you available?";
    
    // Try to generate a short response
    await generateGeminiResponse(testPrompt);
    
    return true;
  } catch (error) {
    console.error('Gemini API check failed:', error);
    return false;
  }
}
