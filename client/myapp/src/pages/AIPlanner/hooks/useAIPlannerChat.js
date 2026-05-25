import { useState, useCallback } from 'react';
import { generateTripPlan } from '../../../api/aiPlanner';

/**
 * Build conversation history from messages state.
 * Converts internal message format to the API format.
 */
const buildHistory = (messages) => {
    return messages
        .filter(msg => msg.type === 'text' || msg.type === 'plan' || msg.type === 'success')
        .map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.sender === 'user'
                ? msg.content
                : msg.type === 'plan' && msg.planData
                    ? `I generated a plan: "${msg.planData.planTitle}" for ${msg.planData.city}, ${msg.planData.duration} days.`
                    : msg.content
        }));
};

/**
 * Strip hydrated place objects down to IDs for sending to backend.
 */
const stripPlanForContext = (plan) => {
    if (!plan) return null;
    return {
        planTitle: plan.planTitle,
        city: plan.city,
        duration: plan.duration,
        planType: plan.planType,
        startDate: plan.startDate,
        budget: plan.budget,
        note: plan.note,
        days: (plan.days || []).map(day => ({
            dayNumber: day.dayNumber,
            date: day.date,
            places: (day.places || []).map(p => ({
                place: p.place?._id || p.place,
                order: p.order,
                visitTime: p.visitTime,
                note: p.note,
            }))
        }))
    };
};

/**
 * Generate smart follow-up suggestions based on plan.
 */
export const buildSmartFollowups = (plan) => {
    const suggestions = [];
    if (plan.duration <= 3) suggestions.push(`Make it ${plan.duration + 2} days`);
    if (plan.duration > 3) suggestions.push(`Shorten to 3 days`);
    if (plan.planType !== 'family') suggestions.push('Make it family-friendly');
    if (plan.planType !== 'adventure') suggestions.push('Add more adventure');
    suggestions.push('Add restaurants to each day');
    suggestions.push('Change the budget');
    return suggestions.slice(0, 4); // Max 4 suggestions
};

export const useAIPlannerChat = (user) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            type: 'text',
            content: "Hey! I'm your Tripfy AI Assistant. Tell me where you'd like to go and what kind of experience you're looking for — I'll build a full itinerary from real places in our database.\n\nYou can also ask me to modify any plan I generate. Try something like \"Plan 3 days in Erbil\" to get started!",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [ragStatus, setRagStatus] = useState(null);
    const [currentPlan, setCurrentPlan] = useState(null);

    const sendMessage = useCallback(async (input) => {
        if (!input.trim() || isLoading) return;

        if (!user) {
            const userMessage = { id: Date.now(), sender: 'user', type: 'text', content: input };
            setMessages(prev => [...prev, userMessage]);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'ai',
                type: 'login-required',
                content: "You need to log in to use the AI Trip Planner. Create a free account to start planning personalized itineraries!",
                suggestedActions: ['Log in', 'Sign up'],
            }]);
            return;
        }

        const userMessage = { id: Date.now(), sender: 'user', type: 'text', content: input };
        setMessages(prev => [...prev, userMessage]);
        
        setIsLoading(true);
        setRagStatus('Thinking...');

        try {
            // Need current messages state here
            setMessages(currentMessages => {
                const asyncRequest = async () => {
                    const history = buildHistory(currentMessages);
                    const planContext = stripPlanForContext(currentPlan);

                    setRagStatus(planContext ? 'Refining your plan...' : 'Searching real places...');
                    
                    try {
                        const response = await generateTripPlan(input, history, planContext);
                        setRagStatus(null);

                        if (response.type === 'other') {
                            setMessages(prev => [...prev, {
                                id: Date.now() + 1,
                                sender: 'ai',
                                type: 'text',
                                content: response.message || "I'm here to help with trip planning! Describe a destination and I'll generate an itinerary.",
                                suggestedActions: response.suggestedActions || [],
                            }]);
                        } else {
                            setCurrentPlan(response);
                            const followUps = buildSmartFollowups(response);

                            setMessages(prev => [...prev, {
                                id: Date.now() + 1,
                                sender: 'ai',
                                type: 'plan',
                                content: planContext
                                    ? `I've updated your plan. Here's the refined version of "${response.planTitle}".`
                                    : `Here's your ${response.duration}-day itinerary for ${response.city}. Review it below — you can ask me to modify anything!`,
                                planData: response,
                                suggestedActions: followUps,
                                detectedContext: {
                                    city: response.city,
                                    duration: response.duration,
                                    planType: response.planType,
                                }
                            }]);
                        }
                    } catch (error) {
                        setRagStatus(null);
                        const isAuthError = error.message?.includes('401') ||
                            error.message?.toLowerCase().includes('auth') ||
                            error.message?.toLowerCase().includes('token') ||
                            error.message?.toLowerCase().includes('log in');

                        if (isAuthError) {
                            setMessages(prev => [...prev, {
                                id: Date.now() + 1,
                                sender: 'ai',
                                type: 'login-required',
                                content: "Your session has expired. Please log in again to continue planning.",
                                suggestedActions: ['Log in'],
                            }]);
                        } else {
                            setMessages(prev => [...prev, {
                                id: Date.now() + 1,
                                sender: 'ai',
                                type: 'text',
                                content: "Sorry, I couldn't process that right now. Please try again in a moment.",
                                suggestedActions: ['Try again', 'Plan 3 days in Erbil'],
                            }]);
                        }
                    } finally {
                        setIsLoading(false);
                    }
                };
                asyncRequest();
                return currentMessages;
            });
        } catch (error) {
            setIsLoading(false);
            setRagStatus(null);
        }
    }, [isLoading, user, currentPlan]);

    return {
        messages,
        setMessages,
        isLoading,
        setIsLoading,
        ragStatus,
        currentPlan,
        setCurrentPlan,
        sendMessage,
    };
};
