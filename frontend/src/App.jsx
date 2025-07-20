// App.jsx - Mock React frontend (with issues)
import React, { useState, useEffect } from "react";
import AddFeedbackPage from "./AddFeedbackPage";
import { colors } from "./constants/colors";
import { feedbackService } from "./serviceFunctions/feedbackService";

function App() {
  const [feedback, setFeedback] = useState([]);
  const [rating, setRating] = useState(null);
  const [showAddFeedback, setShowAddFeedback] = useState(false);

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

      <select onChange={(e) => setRating(e.target.value)}>
        <option value="">All Ratings</option>
        <option value="5">5 Stars</option>
        <option value="1">1 Star</option>
      </select>

      <ul>
        {feedback.map((f, i) => (
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
