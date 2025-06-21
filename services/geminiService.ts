import { FoundBio } from '../types';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the Google AI client.
// API key is expected to be in process.env.API_KEY.
let ai: GoogleGenAI;
const apiKey = "AIzaSyDfT0QYWewRwMJ50ZdxatsOfa6txaqRvZM";
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("API_KEY not found in environment variables. LLM features may not work.");
  // Fallback or error handling if necessary, though instructions say to assume it's pre-configured.
}

export const expandLawFirmName = async (shortName: string, emailDomain: string): Promise<string | null> => {
  if (!ai) {
    console.warn("Gemini AI client not initialized. Cannot expand firm name.");
    return shortName; // Return original shortName if AI client isn't available
  }
  if (!shortName || !emailDomain) return shortName;

  const prompt = `Given an email domain '${emailDomain}' and an initial firm name guess '${shortName}', provide the full, official, and commonly recognized name for this law firm. For example, if the domain is 'linklaters.com' and guess is 'Linklaters', a good answer would be 'Linklaters LLP'. If the domain is 'dwf.law' and guess is 'DWF', a good answer would be 'DWF Group PLC'. If you cannot find a more complete name with high confidence, return the original guess: '${shortName}'. Respond with only the firm name.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
    });
    const expandedName = response.text.trim();
    
    if (expandedName && expandedName.length > 0) {
      // Basic validation: if the model returns something very different or too long, or an error-like message.
      if (expandedName.toLowerCase().includes("sorry") || 
          expandedName.toLowerCase().includes("i cannot") || 
          expandedName.length > 150) { // Arbitrary length check
          return shortName; // Return original if LLM seems to fail or gives boilerplate
      }
      // If LLM returns the exact same short name (case-insensitive), treat as no useful expansion.
      if (expandedName.toLowerCase() === shortName.toLowerCase()) {
        return shortName;
      }
      return expandedName;
    }
    return shortName; // Fallback to shortName if LLM provides empty response
  } catch (error) {
    console.error("Error calling Gemini API for firm name expansion:", error);
    return shortName; // Fallback in case of API error
  }
};


// This is a MOCK function for bio finding.
export const findBio = async (email: string, firm: string): Promise<FoundBio | null> => {
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  // Mocked responses based on input
  if (email.toLowerCase().includes('jane.doe') && firm.toLowerCase().includes('innovate law')) {
    return { name: 'Jane Doe, Esq.', practiceArea: 'Intellectual Property & Technology' };
  } else if (email.toLowerCase().includes('john.smith') && firm.toLowerCase().includes('global legal')) {
    return { name: 'John B. Smith', practiceArea: 'Corporate Law' };
  } else if (firm.toLowerCase().includes('anyfirm bio')) {
     return { name: 'Dr. Example Person', practiceArea: 'AI Ethics & Law'};
  }

  // Default: no bio found
  return null;
};

// Example of how a real call might look for text generation (not used in this mock for bio finding specifically)
export const generateDigestSummary = async (topics: string[]): Promise<string> => {
  if (!ai) {
    console.warn("Gemini AI client not initialized. Cannot generate digest summary.");
    return `Mocked summary for topics: ${topics.join(', ')}. This is a placeholder. AI client not available.`;
  }
  const prompt = `Generate a concise, insightful summary about recent developments in the legal field related to: ${topics.join(', ')}. Focus on impact for legal professionals.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17", 
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating digest summary:", error);
    return "Could not generate summary at this time.";
  }
};
