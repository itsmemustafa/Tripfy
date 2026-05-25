import React, { forwardRef } from 'react';
import './AIPlannerInputArea.css';

const QUICK_STARTS = [
    { label: '🏛️ 3 Days in Erbil', prompt: 'Plan a 3-day weekend exploring historical sites in Erbil' },
    { label: '🌲 Duhok Nature Trip', prompt: 'An adventurous 5-day nature trip in Duhok' },
    { label: '☕ Sulaymaniyah Getaway', prompt: 'A relaxing weekend getaway in Sulaymaniyah with cafés and culture' },
    { label: '👨‍👩‍👧 Family in Halabja', prompt: 'A family-friendly 3-day trip to Halabja with nature and waterfalls' },
];

const AIPlannerInputArea = forwardRef(({
    input,
    setInput,
    isLoading,
    currentPlan,
    handleSend,
    showQuickStarts
}, ref) => {
    return (
        <div className="aip-input-area">
            {showQuickStarts && !isLoading && (
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
                    ref={ref}
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
    );
});

export default AIPlannerInputArea;
