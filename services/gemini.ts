import { GoogleGenAI, Type } from "@google/genai";
import { EquationResponse } from "../types";

const processEquationImage = async (base64Image: string): Promise<EquationResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Using gemini-3-flash-preview for fast multimodal reasoning
  const modelId = "gemini-3-flash-preview"; 
  
  const prompt = `
    Analyze the provided image which contains a mathematical equation or expression.
    Your task is to extract this equation and format it for professional document use.
    
    1. Extract the equation into standard LaTeX format. Ensure it is clean (e.g., use \\frac instead of / where appropriate). Do not wrap it in $ or $$ delimiters in the JSON output, just the raw code.
    2. Convert the equation into valid MathML format suitable for pasting into MS Word.
    3. Provide a very brief (one sentence) explanation of what the equation represents if recognized (e.g., "Quadratic Formula", "Maxwell's Equations").

    If the image does not contain a clear equation, return an empty string for the fields or a polite error in the explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            latex: {
              type: Type.STRING,
              description: "The raw LaTeX code for the equation",
            },
            mathml: {
              type: Type.STRING,
              description: "The MathML code for the equation",
            },
            explanation: {
              type: Type.STRING,
              description: "A brief label or explanation of the equation",
            },
          },
          required: ["latex", "mathml", "explanation"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    return JSON.parse(text) as EquationResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process equation. Please try again.");
  }
};

export { processEquationImage };
