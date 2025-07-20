// App.tsx - React frontend with TypeScript
import React, { useState, useEffect } from "react";
import AddFeedbackPage from "./AddFeedbackPage";
import { colors } from "./constants/colors";
import { feedbackService } from "./serviceFunctions/feedbackService";
import { Feedback } from "./feedbackTypes/feedbackTypes";

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

    return (
        <div>
            <h1>Feedback Dashboard</h1>

            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={() => setShowAddFeedback(true)}
                    style={{
                        backgroundColor: colors.button.primary.background,
                        color: colors.button.primary.text,
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                    }}
                >
                    Add Feedback
                </button>
            </div>

            <select onChange={handleRatingChange} value={rating || ""}>
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
            </select>

            <ul>
                {feedback.map((f: Feedback, i: number) => (
                    <li key={i}>
                        {f.message} - {f.rating} stars
                    </li>
                ))}
            </ul>

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