import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import logger from "./logger.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getFallbackAi = () => {
  return process.env.GEMINI_API_KEY2 ? new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY2,
  }) : null;
};

const generateWithGemini = async (genAiInstance, prompt) => {
  const response = await genAiInstance.models.generateContent({
    // Downgrading to gemini-1.5-flash as 2.5-flash is experiencing 503 high demand issues :(
    model: "gemini-1.5-flash",
    contents: prompt,
  });
  if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts[0]) {
    return response.candidates[0].content.parts[0].text;
  }
  throw new Error("Invalid Gemini response structure");
};

const generateWithGroq = async (prompt) => {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not found in env");
  const groq = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });
  return response.choices[0].message.content;
};

const generateWithDeepseek = async (prompt) => {
  if (!process.env.DEEPSEEK_API_KEY) throw new Error("DEEPSEEK_API_KEY not found in env");
  const ds = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: "https://api.deepseek.com/v1" });
  const response = await ds.chat.completions.create({
    model: "deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });
  return response.choices[0].message.content;
};

const matchPlans = async ({ places, type = 'plan' }, userPrompt, userId) => {
  const currentDate = new Date().toISOString().split("T")[0];

  const hasPlaces = Array.isArray(places) && places.length > 0;
  let systemPrompt;

  if (type === 'other') {
    systemPrompt = `
You are a helpful travel assistant for Tripfy, a trip planning web application.

About Tripfy:
Tripfy allows users to browse destinations in Kurdistan (Erbil, Sulaymaniyah, Duhok), create personalized travel plans, and leave reviews for places they've visited.

Today is ${currentDate}.
The user says: "${userPrompt}"

Return ONLY valid JSON in this format:
{
  "type": "other",
  "message": "string (conversational response, friendly and helpful)",
  "suggestedActions": ["string (optional short follow-up questions or actions)"]
}

Rules:
- Be friendly and helpful.
- If they are just greeting, greet back warmly.
- If asking general questions about Tripfy or travel, answer briefly.
- You can mention Tripfy features when relevant (browsing destinations, creating plans, reading reviews).
- Do NOT generate a trip plan structure.
`;
  } else {
    // Normal plan generation
    systemPrompt = hasPlaces
      ? `
You are a travel planning assistant for Tripfy, a trip planning web application.

About Tripfy:
Tripfy helps users browse destinations in Kurdistan, create personalized travel plans, and read reviews from other travelers.

Today is ${currentDate}.
Base the plan on this user intent:
"${userPrompt}"

Return ONLY valid JSON without any markdown formatting, code blocks, or extra text.
JSON format:
{
  "planTitle": "string",
  "city": "string (Erbil, Sulaymaniyah, or Duhok)",
  "duration": number,
  "planType": "leisure | adventure | family | solo | romantic | business",
  "startDate": "YYYY-MM-DD",
  "budget": {
    "amount": number (optional, estimated budget if user mentioned),
    "currency": "USD | EUR | GBP | JPY | CNY"
  },
  "status": "draft",
  "note": "string (brief description or special notes)",
  "days": [
    {
      "dayNumber": number,
      "date": "YYYY-MM-DD",
      "places": [
        {
          "place": "ObjectId string (from input places)",
          "order": number,
          "visitTime": "string (e.g., '09:00 AM', 'Morning', 'Afternoon')",
          "note": "string (optional activity or tip)"
        }
      ]
    }
  ]
}

Input places available:
${JSON.stringify(places, null, 2)}

Rules:
- Select relevant "_id" values from Input places for "place" field.
- Do NOT invent places - only use _id from the provided list.
- startDate must be at least one day after ${currentDate}.
- Generate complete "days" array matching the duration.
- Each day should have dayNumber (1, 2, 3...) and date.
- Arrange places in logical order within each day.
- Suggest realistic visitTime for each place.
- If user mentions budget, include it in the budget object.
- Always set status to "draft".
- Return ONLY the JSON object, no markdown or code blocks.
`
      : `
You are a travel planning assistant for Tripfy, a trip planning web application.

About Tripfy:
Tripfy helps users browse destinations in Kurdistan, create personalized travel plans, and read reviews from other travelers.

Today is ${currentDate}.
The user wants travel planning help based on this intent:
"${userPrompt}"

Return ONLY valid JSON without any markdown formatting, code blocks, or extra text.
JSON format:
{
  "planTitle": "string",
  "city": "string (Erbil, Sulaymaniyah, or Duhok)",
  "duration": number,
  "planType": "leisure | adventure | family | solo | romantic | business",
  "startDate": "YYYY-MM-DD",
  "budget": {
    "amount": number (optional, estimated budget if user mentioned),
    "currency": "USD | EUR | GBP | JPY | CNY"
  },
  "status": "draft",
  "note": "string (brief description, mention that specific places will be added later)",
  "days": []
}

Rules:
- No database places are available yet.
- "days" must be an empty array (places will be added later).
- startDate must be at least one day after ${currentDate}.
- If user mentions budget, include it in the budget object.
- In the note field, mention that this is a draft plan and places will be selected later.
- Always set status to "draft".
- Return ONLY the JSON object, no markdown or code blocks.
`;
  }

  let text = "";
  try {
    // Attempt 1: Primary Gemini Key
    text = await generateWithGemini(ai, systemPrompt);
  } catch (error) {
    logger.warn("Primary Gemini Key failed", { message: error.message });
    try {
      // Attempt 2: Secondary Gemini Key
      const fallbackAi = getFallbackAi();
      if (!fallbackAi) throw new Error("No secondary Gemini key available");
      text = await generateWithGemini(fallbackAi, systemPrompt);
    } catch (fallbackError) {
      logger.warn("Secondary Gemini Key failed", { message: fallbackError.message });
      try {
        // Attempt 3: Groq LLM Fallback
        logger.info("Attempting fallback to Groq");
        text = await generateWithGroq(systemPrompt);
      } catch (groqError) {
        logger.warn("Groq fallback failed", { message: groqError.message });
        // Attempt 4: DeepSeek LLM Fallback
        logger.info("Attempting fallback to DeepSeek");
        text = await generateWithDeepseek(systemPrompt);
      }
    }
  }

  // Clean up any markdown code blocks
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  // Parse and add the user field
  try {
    const parsedPlan = JSON.parse(text);

    // Only add user field for plan type (not 'other')
    if (type !== 'other' && userId) {
      parsedPlan.user = userId;
    }

    return JSON.stringify(parsedPlan);
  } catch (error) {
    logger.error("Failed to parse AI response", { message: error.message, raw: text.slice(0, 200) });
    return text; // Return original if parsing fails
  }
};

export default matchPlans;