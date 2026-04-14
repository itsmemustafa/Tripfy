import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import logger from "./logger.js";

/**
 * Accepts a system prompt + array of chat messages [{ role, content }]
 * Tries providers in order: Gemini (key1) → Gemini (key2) → Groq → DeepSeek
 */

//  Provider initializers 

const getGeminiPrimary = () => {
    if (!process.env.GEMINI_API_KEY) return null;
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const getGeminiFallback = () => {
    if (!process.env.GEMINI_API_KEY2) return null;
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY2 });
};

//  Gemini generator 

const generateWithGemini = async (genAiInstance, systemPrompt, messages) => {
    const contents = messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
    }));

    const response = await genAiInstance.models.generateContent({
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt,
        contents,
    });

    if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.candidates[0].content.parts[0].text;
    }
    throw new Error("Invalid Gemini response structure");
};

//  OpenAI-compatible generator (Groq, DeepSeek) 

const generateWithOpenAICompat = async (client, model, systemPrompt, messages) => {
    const chatMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map(msg => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content
        }))
    ];

    const response = await client.chat.completions.create({
        model,
        messages: chatMessages,
        response_format: { type: "json_object" },
        temperature: 0.3,
    });

    return response.choices[0].message.content;
};

const generateWithGroq = async (systemPrompt, messages) => {
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not found");
    const groq = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1"
    });
    return generateWithOpenAICompat(groq, "llama-3.3-70b-versatile", systemPrompt, messages);
};

const generateWithDeepseek = async (systemPrompt, messages) => {
    if (!process.env.DEEPSEEK_API_KEY) throw new Error("DEEPSEEK_API_KEY not found");
    const ds = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: "https://api.deepseek.com/v1"
    });
    return generateWithOpenAICompat(ds, "deepseek-chat", systemPrompt, messages);
};

//  Main export: cascading fallback 

export const generateAIResponse = async (systemPrompt, messages) => {
    const attempts = [];

    // Attempt 1: Primary Gemini
    const gemini1 = getGeminiPrimary();
    if (gemini1) {
        try {
            return await generateWithGemini(gemini1, systemPrompt, messages);
        } catch (err) {
            logger.warn("[AI Engine] Gemini primary failed", { message: err.message });
            attempts.push(`Gemini-1: ${err.message}`);
        }
    }

    // Attempt 2: Secondary Gemini
    const gemini2 = getGeminiFallback();
    if (gemini2) {
        try {
            return await generateWithGemini(gemini2, systemPrompt, messages);
        } catch (err) {
            logger.warn("[AI Engine] Gemini fallback failed", { message: err.message });
            attempts.push(`Gemini-2: ${err.message}`);
        }
    }

    // Attempt 3: Groq
    try {
        logger.info("[AI Engine] Attempting Groq");
        return await generateWithGroq(systemPrompt, messages);
    } catch (err) {
        logger.warn("[AI Engine] Groq failed", { message: err.message });
        attempts.push(`Groq: ${err.message}`);
    }

    // Attempt 4: DeepSeek
    try {
        logger.info("[AI Engine] Attempting DeepSeek");
        return await generateWithDeepseek(systemPrompt, messages);
    } catch (err) {
        logger.warn("[AI Engine] DeepSeek failed", { message: err.message });
        attempts.push(`DeepSeek: ${err.message}`);
    }

    // All providers failed
    throw new Error(`All AI providers failed. Attempts: ${attempts.join(" | ")}`);
};
