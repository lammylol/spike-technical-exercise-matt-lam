// AddFeedbackPage.jsx is a modal for adding feedback.
// It is used to add feedback to the database from the client.

import React, { useState } from "react";
import { feedbackService } from "./serviceFunctions/feedbackService";
import "./AddFeedbackPage.css";
import { createFeedback } from "./feedbackTypes/feedbackTypes";

/**
 * AddFeedbackPage component for adding new feedback
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Callback function when modal is closed
 * @param {Function} props.onFeedbackAdded - Callback function when feedback is successfully added
 */
function AddFeedbackPage({ onClose, onFeedbackAdded }) {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handles form submission and creates a Feedback object
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    // Prevent the default form submission behavior.
    e.preventDefault();

    // Set the submitting state to true and clear any previous errors.
    setIsSubmitting(true);
    setError("");

    try {
      // Use the createFeedback utility function to ensure type safety
      const feedbackData = createFeedback(parseInt(rating), message.trim());

      await feedbackService.submitFeedback(feedbackData);

      // Reset form
      setRating(5);
      setMessage("");

      // Notify parent component when feedback is added.
      if (onFeedbackAdded) {
        onFeedbackAdded();
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Feedback</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="rating">Rating:</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your feedback..."
              rows="4"
              required={false} // optional field
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFeedbackPage;
