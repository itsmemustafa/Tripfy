import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { generateTripPlan } from '../../api/aiPlanner';
import { createPlan, getPlans } from '../../api/plans';
import MessageBubble from './components/MessageBubble';
import AIPlannerSidebar from './components/AIPlannerSidebar';
import './AIPlanner.css';

const QUICK_STARTS = [
    { label: '🏛️ 3 Days in Erbil', prompt: 'Plan a 3-day weekend exploring historical sites in Erbil' },
    { label: '🌲 Duhok Nature Trip', prompt: 'An adventurous 5-day nature trip in Duhok' },
    { label: '☕ Sulaymaniyah Getaway', prompt: 'A relaxing weekend getaway in Sulaymaniyah with cafés and culture' },
    { label: '👨‍👩‍👧 Family in Halabja', prompt: 'A family-friendly 3-day trip to Halabja with nature and waterfalls' },
];

const AIPlanner = () => {
    const navigate = useNavigate();
    const { user, openAuthModal } = useAuth();

    const [savedPlans, setSavedPlans] = useState([]);
    const [activePlanId, setActivePlanId] = useState(null);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            type: 'text',
            content: "Hey! I'm your Tripfy AI Assistant. Tell me where you'd like to go and what kind of experience you're looking for — I'll build a full itinerary from real places in our database.\n\nYou can also ask me to modify any plan I generate. Try something like \"Plan 3 days in Erbil\" to get started!",
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [ragStatus, setRagStatus] = useState(null);
    const [currentPlan, setCurrentPlan] = useState(null); // Track the latest generated plan
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Remove stale login-required prompts after successful authentication.
    useEffect(() => {
        if (!user) return;
        setMessages(prev => prev.filter(msg => msg.type !== 'login-required'));
    }, [user]);

    // Fetch user's existing plans for the sidebar
    useEffect(() => {
        if (user) {
            const fetchUserPlans = async () => {
                try {
                    const response = await getPlans({ limit: 50 });
                    if (response.plans) {
                        setSavedPlans(response.plans.map(p => ({
                            id: p._id,
                            title: p.planTitle,
                            city: p.city,
                            duration: p.duration,
                        })));
                    }
                } catch (error) {
                    console.error("Failed to fetch user plans:", error);
                }
            };
            fetchUserPlans();
        }
    }, [user]);

    // Build conversation history from messages state.
    // Converts our internal message format to the API format.
    const buildHistory = () => {
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

    // Strip hydrated place objects down to IDs for sending to backend.
    // The backend needs the plan structure but not the full Mongoose docs.
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

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        // Check if user is logged in before sending 
        if (!user) {
            const userMessage = { id: Date.now(), sender: 'user', type: 'text', content: input };
            setMessages(prev => [...prev, userMessage]);
            setInput('');
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
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        setRagStatus('Thinking...');

        try {
            const history = buildHistory();
            const planContext = stripPlanForContext(currentPlan);

            setRagStatus(planContext ? 'Refining your plan...' : 'Searching real places...');

            const response = await generateTripPlan(currentInput, history, planContext);
            setRagStatus(null);

            if (response.type === 'other') {
                // Conversational response
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: 'ai',
                    type: 'text',
                    content: response.message || "I'm here to help with trip planning! Describe a destination and I'll generate an itinerary.",
                    suggestedActions: response.suggestedActions || [],
                }]);
            } else {
                // Plan response — store it as current plan for future refinements
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

            // Detect auth errors (401 / token expired)
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

    // Generate smart follow-up suggestions based on what was just generated.
    const buildSmartFollowups = (plan) => {
        const suggestions = [];
        if (plan.duration <= 3) suggestions.push(`Make it ${plan.duration + 2} days`);
        if (plan.duration > 3) suggestions.push(`Shorten to 3 days`);
        if (plan.planType !== 'family') suggestions.push('Make it family-friendly');
        if (plan.planType !== 'adventure') suggestions.push('Add more adventure');
        suggestions.push('Add restaurants to each day');
        suggestions.push('Change the budget');
        return suggestions.slice(0, 4); // Max 4 suggestions
    };

    const handleAcceptPlan = async (planData) => {
        if (!user) {
            alert('Please log in to save your plan.');
            return;
        }
        try {
            setIsLoading(true);
            const formattedDays = (planData.days || []).map(day => ({
                ...day,
                places: (day.places || []).map(placeItem => ({
                    ...placeItem,
                    place: placeItem.place?._id || placeItem.place,
                })),
            }));

            const newPlan = {
                planTitle: planData.planTitle,
                city: planData.city,
                duration: planData.duration,
                startDate: planData.startDate,
                planType: planData.planType,
                days: formattedDays,
                budget: planData.budget,
                status: planData.status || 'draft',
                note: planData.note || '',
            };

            const saved = await createPlan(newPlan);
            setSavedPlans(prev => [...prev, {
                id: saved.plan._id,
                title: planData.planTitle,
                city: planData.city,
                duration: planData.duration,
            }]);
            setActivePlanId(saved.plan._id);

            // Don't navigate away — let user stay in chat
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'ai',
                type: 'success',
                content: `✓ "${planData.planTitle}" saved to your plans! You can view it in My Plans anytime.`,
                planId: saved.plan._id,
                suggestedActions: [
                    'Plan another trip',
                    'View saved plan',
                ],
            }]);
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'ai',
                type: 'text',
                content: ' Failed to save the plan. Please try again.',
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegenerate = (planData) => {
        // Pre-fill the input to prompt a modification
        setInput('');
        setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'ai',
            type: 'text',
            content: `What would you like me to change about "${planData.planTitle}"? I remember the full plan, so just tell me what to adjust.`,
            suggestedActions: buildSmartFollowups(planData),
        }]);
        inputRef.current?.focus();
    };

    const handleNewTrip = () => {
        setCurrentPlan(null);
        setActivePlanId(null);
        setMessages([{
            id: 1,
            sender: 'ai',
            type: 'text',
            content: "Let's plan a new trip! Where would you like to go?",
        }]);
        setInput('');
        inputRef.current?.focus();
    };

    const handleSuggestionClick = (val) => {
        if (val === 'Log in') {
            openAuthModal('login');
            return;
        }
        if (val === 'Sign up') {
            openAuthModal('signup');
            return;
        }
        if (val === 'View saved plan' && activePlanId) {
            navigate(`/my-plans/${activePlanId}`);
            return;
        }
        if (val === 'Plan another trip') {
            handleNewTrip();
            return;
        }
        setInput(val);
        inputRef.current?.focus();
    };

    const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';

    return (
        <div className="aip-layout">
            {/*  Sidebar  */}
            <AIPlannerSidebar
                savedPlans={savedPlans}
                activePlanId={activePlanId}
                setActivePlanId={setActivePlanId}
                handleNewTrip={handleNewTrip}
                user={user}
                userInitial={userInitial}
            />

            {/*  Main  */}
            <main className="aip-main">
                <div className="aip-header">
                    <div className="aip-header-left">
                        <button className="aip-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        <h1 className="aip-header-title">Trip Planner Assistant</h1>
                        <p className="aip-header-subtitle">
                            {currentPlan
                                ? `Editing: ${currentPlan.planTitle} · ${currentPlan.city}`
                                : 'Describe your trip and get a real-data itinerary in seconds'}
                        </p>
                    </div>
                    <div className="aip-header-badges">
                        <span className="aip-badge aip-badge--primary">AI-Powered</span>
                        {currentPlan && (
                            <span className="aip-badge aip-badge--context">
                                {currentPlan.city} · {currentPlan.duration}d
                            </span>
                        )}
                        <span className="aip-badge aip-badge--muted">Real Places · {savedPlans.length} Saved</span>
                    </div>
                </div>

                <div className="aip-messages">
                    {messages.map(msg => (
                        <MessageBubble
                            key={msg.id}
                            msg={msg}
                            userInitial={userInitial}
                            onAccept={handleAcceptPlan}
                            onRegenerate={handleRegenerate}
                            onSuggestionClick={handleSuggestionClick}
                            isLoading={isLoading}
                        />
                    ))}

                    {isLoading && (
                        <div className="aip-message aip-message--ai">
                            <div className="aip-avatar aip-avatar--ai">AI</div>
                            <div className="aip-bubble aip-bubble--ai">
                                {ragStatus && (
                                    <div className="aip-rag-status">
                                        <span className="aip-rag-dot" />
                                        <span className="aip-rag-text">{ragStatus}</span>
                                    </div>
                                )}
                                <div className="aip-typing">
                                    <span className="aip-dot" />
                                    <span className="aip-dot" />
                                    <span className="aip-dot" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="aip-input-area">
                    {messages.length === 1 && !isLoading && (
                        <div className="aip-chips-row">
                            {QUICK_STARTS.map((qs, i) => (
                                <button key={i} className="aip-chip" onClick={() => setInput(qs.prompt)}>
                                    {qs.label}
                                </button>
                            ))}
                        </div>
                    )}
                    <form className="aip-input-form" onSubmit={handleSend}>
                        <input
                            ref={inputRef}
                            className="aip-input"
                            type="text"
                            placeholder={currentPlan
                                ? `Modify "${currentPlan.planTitle}"... e.g. "Add restaurants" or "Make it 5 days"`
                                : "Where would you like to go? e.g. 3 days in Erbil..."}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button className="aip-send-btn" type="submit" disabled={!input.trim() || isLoading}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AIPlanner;
