import { GoogleGenAI } from "@google/genai";

const AI_KEY = process.env.API_KEY || ''; 

// We instantiate inside the function or check existence to avoid crashes if env is missing during init
export const askAITutor = async (currentTopic: string, userQuestion: string): Promise<string> => {
  if (!AI_KEY) {
    return "API Key is missing. Please check your environment variables.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: AI_KEY });
    
    // We use a lighter model for quick explanations
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert English teacher for Portuguese speakers.
      
      Current Lesson Topic: ${currentTopic}
      Student Question: "${userQuestion}"
      
      Explain the concept clearly in Portuguese, but provide examples in English.
      Keep it concise (max 2 paragraphs). Use markdown for bolding key terms.`,
    });

    return response.text || "Sorry, I couldn't generate an explanation at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com o Tutor IA. Tente novamente mais tarde.";
  }
};