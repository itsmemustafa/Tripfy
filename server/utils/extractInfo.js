import OpenAI from "openai";
import logger from "./logger.js";

// Using Groq - Free AI provider with OpenAI-compatible API
//to extract info from the prompt
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const extractInfo = async (prompt) => {
  try {
    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      return {
        error:
          "Groq API key is not configured. Please set GROQ_API_KEY in your .env file. Get a free key at https://console.groq.com",
        statusCode: 500,
      };
    }

    const completion = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an intent-aware trip data extractor.
Your goal is to classify the user's input and extract relevant trip details if applicable.

Output JSON Format:
{
    "type": "plan" | "other",
    "city": "string (Erbil, Sulaymaniyah, or Duhok) or null",
    "category": ["array", "of", "interests"] or []
}

Rules for "type":
1. Set "type": "plan" ONLY if the user is explicitly asking for:
   - Trip plans
   - Places to visit
   - Recommendations (restaurants, hotels, spots)
   - "Show me X in Y"
   - "Where can I go in..."
2. Set "type": "other" for EVERYTHING else, including:
   - Greetings ("hello", "hi", "good morning")
   - General questions ("how are you", "who are you")
   - Irrelevant inputs ("weather", "politics")
   - Gibberish

Rules for "city" (only if type is "plan"):
- Must be one of: "Erbil", "Sulaymaniyah", "Duhok".
- If not specified, infer from context if possible, otherwise default to "Erbil".
- If type is "other", set to null.

Rules for "category" (only if type is "plan"):
- Must be a subset of: ["Adventure", "Restaurant", "Nature", "Cafe", "Historical", "Religious"].
- Return [] if no specific category is mentioned.
- If type is "other", return [].

Examples:
Input: "Hello" -> {"type": "other", "city": null, "category": []}
Input: "Plan a trip to Erbil" -> {"type": "plan", "city": "Erbil", "category": []}
Input: "I want to eat in Duhok" -> {"type": "plan", "city": "Duhok", "category": ["Restaurant"]}
Input: "How are you?" -> {"type": "other", "city": null, "category": []}
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return { ...result };
  } catch (error) {
    logger.error("Groq API Error", { message: error.message, status: error.status });

    // Handle specific error types
    if (error.status === 401) {
      return {
        error:
          "Invalid Groq API key. Please check your GROQ_API_KEY in .env file. Get a free key at https://console.groq.com",
        statusCode: 401,
      };
    }

    if (error.status === 429) {
      return {
        error: "Rate limit exceeded. Please try again later.",
        statusCode: 429,
      };
    }

    return {
      error: error.message || "Processing failed",
      statusCode: error.status || 500,
    };
  }
};

export default extractInfo;