import { StatusCodes } from "http-status-codes";
import Place from "../../models/place.js";
import { generateAIResponse } from "../../utils/aiEngine.js";
import logger from "../../utils/logger.js";

/**
 * AI Planner Controller :) 
 *
 * Flow:
 *   1. Fetch ALL places from DB upfront (lightweight)
 *   2. Include them in the system prompt so the AI can assign real IDs
 *   3. Single AI call: classifies intent + generates plan with real places
 *   4. Hydrate place IDs with full DB documents
 */
const aiPlanner = async (req, res) => {
    try {
        const { prompt, history = [], currentPlan = null } = req.body;

        if (!prompt) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                msg: "Prompt is required"
            });
        }

        //  1. Fetch all places upfront 
        const allPlaces = await Place.find({})
            .select("_id name category subcategory location.city description rating")
            .lean();

        const placesForPrompt = allPlaces.map(p => ({
            _id: p._id.toString(),
            name: p.name,
            category: p.category,
            subcategory: p.subcategory,
            city: p.location?.city,
            description: p.description?.slice(0, 100), // truncate to save tokens
            rating: p.rating,
        }));

        //  2. Build system prompt with places baked in 
        const currentDate = new Date().toISOString().split("T")[0];
        const systemInstruction = buildSystemPrompt(currentDate, currentPlan, placesForPrompt);

        //  3. Build chat messages 
        const messages = [];

        // Add up to 10 most recent history messages
        const recentHistory = history.slice(-10);
        for (const msg of recentHistory) {
            messages.push({
                role: msg.role === "user" ? "user" : "model",
                content: msg.content
            });
        }

        // Add the current user prompt
        messages.push({ role: "user", content: prompt });

        //  4. Single AI call 
        const rawResponse = await generateAIResponse(systemInstruction, messages);
        let jsonResponse;
        try {
            const cleaned = rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            jsonResponse = JSON.parse(cleaned);
        } catch (e) {
            logger.error("Failed to parse AI response", { raw: rawResponse.slice(0, 200) });
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                msg: "Failed to generate a valid response"
            });
        }

        //  5. Hydrate place IDs with full DB data 
        if (jsonResponse.type !== "other" && jsonResponse.days && Array.isArray(jsonResponse.days)) {
            const placeMap = new Map(allPlaces.map(p => [p._id.toString(), p]));

            jsonResponse.days.forEach(day => {
                if (day.places && Array.isArray(day.places)) {
                    day.places = day.places.map(placeItem => {
                        const placeId = typeof placeItem.place === "string"
                            ? placeItem.place
                            : placeItem.place?._id?.toString();

                        if (!placeId) return null;
                        const fullPlace = placeMap.get(placeId);
                        if (!fullPlace) {
                            logger.warn("Place ID not found in DB during AI plan hydration", { placeId });
                            return null;
                        }
                        return { ...placeItem, place: fullPlace };
                    }).filter(Boolean);
                }
            });

            // Add user ID
            if (req.user?.userId) {
                jsonResponse.user = req.user.userId;
            }
        }

        return res.status(StatusCodes.OK).json(jsonResponse);
    } catch (error) {
        logger.error("AI Planner Error", { message: error.message, stack: error.stack });
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: error.message || "Failed to process AI request"
        });
    }
};

/**
 * Builds the system prompt with real places included
 */
function buildSystemPrompt(currentDate, currentPlan, places) {
    const planContext = currentPlan
        ? `\nThe user previously generated this plan (they may want to modify it):\n${JSON.stringify(currentPlan, null, 2)}\n`
        : '';

    const placesJSON = JSON.stringify(places, null, 2);

    return `You are a travel planning AI assistant for Tripfy, a trip planning app for Iraq.

Today is ${currentDate}.
${planContext}
══════════════════════════════════════════
AVAILABLE PLACES IN OUR DATABASE:
══════════════════════════════════════════
${placesJSON}

══════════════════════════════════════════
YOUR JOB:
══════════════════════════════════════════
1. Understand the user's intent from their message AND conversation history
2. Return ONLY valid JSON (no markdown, no code blocks, no extra text)

═══ IF casual conversation (greeting, question, off-topic) ═══
Return:
{
  "type": "other",
  "message": "string (friendly, helpful response)",
  "suggestedActions": ["short follow-up suggestions"]
}

═══ IF the user wants a trip plan (new or modified) ═══
Return:
{
  "type": "plan",
  "planTitle": "string",
  "city": "string (Erbil | Sulaymaniyah | Duhok | Halabja)",
  "duration": number,
  "planType": "leisure | adventure | family | solo | romantic | business",
  "startDate": "YYYY-MM-DD",
  "budget": { "amount": number, "currency": "USD" },
  "status": "draft",
  "note": "string (brief trip description)",
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "places": [
        {
          "place": "EXACT _id string from the AVAILABLE PLACES list above",
          "order": 1,
          "visitTime": "09:00 AM",
          "note": "activity tip"
        }
      ]
    }
  ]
}

CRITICAL RULES:
- You MUST use ONLY the _id values from the AVAILABLE PLACES list above for the "place" field
- Do NOT invent place IDs — only use exact _id strings from the list
- Each day MUST have at least 2-3 places
- Filter places by the city the user wants (match the "city" field)
- startDate must be after ${currentDate}
- "duration" must match the number of items in "days"
- Arrange places in a logical visiting order within each day
- Suggest realistic visitTime for each place (Morning, Afternoon, Evening)
- If the user is MODIFYING an existing plan, keep unchanged parts and only modify what they asked
- For follow-up messages like "make it 5 days" or "add restaurants", use conversation history to understand context
- Default city to Erbil if unclear
- Always return valid JSON only — no prose, no markdown`;
}

export default aiPlanner;