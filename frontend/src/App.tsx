// App.tsx - React frontend with TypeScript
import React, { useState, useEffect } from "react";
import AddFeedbackPage from "./AddFeedbackPage";
import { feedbackService } from "./serviceFunctions/feedbackService";
import { Feedback } from "./feedbackTypes/feedbackTypes";
import "./App.css";

function App() {
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [rating, setRating] = useState<number | null>(null);
    const [showAddFeedback, setShowAddFeedback] = useState<boolean>(false);

    useEffect(() => {
        feedbackService
            .getFeedback(rating)
            .then((data) => setFeedback(data))
            .catch((err) => console.error("Error fetching feedback:", err));
    }, [rating]);

    const handleFeedbackAdded = () => {
        // Refresh the feedback list when new feedback is added
        feedbackService
            .getFeedback(rating)
            .then((data) => setFeedback(data))
            .catch((err) => console.error("Error fetching feedback:", err));
    };

    const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setRating(value === "" ? null : parseInt(value));
    };

    const renderStars = (rating: number) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

    // Calculate NPS Score
    const calculateNPS = () => {
        if (feedback.length === 0) return 0;

        const promoters = feedback.filter(f => f.rating >= 4).length;
        const detractors = feedback.filter(f => f.rating <= 2).length;
        const total = feedback.length;

        return Math.round(((promoters - detractors) / total) * 100);
    };

    // Calculate 5-star percentage
    const calculateFiveStarPercentage = () => {
        if (feedback.length === 0) return 0;

        const fiveStarCount = feedback.filter(f => f.rating === 5).length;
        return Math.round((fiveStarCount / feedback.length) * 100);
    };

    // AI Suggested Opportunities (Fake Data)
    const getAISuggestions = () => {
        const suggestions = [
            {
                title: "Response Time Optimization",
                description: "Based on recent feedback, customers expect faster response times. Consider implementing automated acknowledgments.",
                impact: "High",
                confidence: 87,
                category: "Customer Service"
            },
            {
                title: "Mobile Experience Enhancement",
                description: "30% of negative reviews mention mobile interface issues. Prioritize mobile UX improvements.",
                impact: "Medium",
                confidence: 92,
                category: "User Experience"
            },
            {
                title: "Feature Request: Dark Mode",
                description: "Multiple users have requested dark mode. This could improve user satisfaction by 15%.",
                impact: "Low",
                confidence: 78,
                category: "Product Enhancement"
            }
        ];

        // Return the highest confidence suggestion
        return suggestions.sort((a, b) => b.confidence - a.confidence)[0];
    };

    const npsScore = calculateNPS();
    const fiveStarPercentage = calculateFiveStarPercentage();
    const aiSuggestion = getAISuggestions();

    return (
        <div className="app-container">
            <div className="app-content">
                {/* Header */}
                <header className="app-header">
                    <h1 className="app-title">
                        Feedback Dashboard
                    </h1>
                    <p className="app-subtitle">
                        Share your thoughts and see what others are saying
                    </p>
                </header>

                {/* Metrics Section */}
                <div className="metrics-section">
                    <div className="metric-card">
                        <div className="metric-content">
                            <div className="metric-value">{npsScore}</div>
                            <div className="metric-label">NPS Score</div>
                            <div className="metric-description">
                                {npsScore >= 50 ? "Excellent" : npsScore >= 0 ? "Good" : "Needs Improvement"}
                            </div>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-content">
                            <div className="metric-value">{fiveStarPercentage}%</div>
                            <div className="metric-label">5-Star Reviews</div>
                            <div className="metric-description">
                                {fiveStarPercentage >= 80 ? "Outstanding" : fiveStarPercentage >= 60 ? "Good" : "Room for Growth"}
                            </div>
                        </div>
                    </div>

                    <div className="metric-card ai-suggestion-card">
                        <div className="metric-content">
                            <div className="ai-header">
                                <div className="ai-icon">🤖</div>
                                <div className="ai-confidence">{aiSuggestion.confidence}%</div>
                            </div>
                            <div className="ai-title">{aiSuggestion.title}</div>
                            <div className="ai-category">{aiSuggestion.category}</div>
                            <div className="ai-description">{aiSuggestion.description}</div>
                            <div className="ai-impact">
                                <span className={`impact-badge impact-${aiSuggestion.impact.toLowerCase()}`}>
                                    {aiSuggestion.impact} Impact
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Section */}
                <div className="controls-section">
                    <button
                        onClick={() => setShowAddFeedback(true)}
                        className="add-feedback-btn"
                    >
                        Add Feedback
                    </button>

                    <select
                        onChange={handleRatingChange}
                        value={rating || ""}
                        className="rating-filter"
                    >
                        <option value="">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>

                {/* Feedback List */}
                <div className="feedback-list">
                    {feedback.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📝</div>
                            <h3 className="empty-state-title">
                                No feedback yet
                            </h3>
                            <p className="empty-state-text">
                                Be the first to share your thoughts!
                            </p>
                        </div>
                    ) : (
                        <div>
                            {feedback.map((f: Feedback, i: number) => (
                                <div
                                    key={i}
                                    className="feedback-item"
                                >
                                    <div className="feedback-header">
                                        <div className="feedback-stars">
                                            {renderStars(f.rating)}
                                        </div>
                                        <span className="feedback-date">
                                            {f.created_at ? new Date(f.created_at).toLocaleDateString() : "Recently"}
                                        </span>
                                    </div>
                                    <p className="feedback-message">
                                        {f.message || "No message provided"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats */}
                {feedback.length > 0 && (
                    <div className="stats-section">
                        <span className="stats-text">
                            Showing {feedback.length} feedback {rating ? `with ${rating} stars` : "entries"}
                        </span>
                    </div>
                )}
            </div>

            {showAddFeedback && (
                <AddFeedbackPage
                    onClose={() => setShowAddFeedback(false)}
                    onFeedbackAdded={handleFeedbackAdded}
                />
            )}
        </div>
    );
}

export default App; 