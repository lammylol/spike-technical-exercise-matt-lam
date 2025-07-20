// AddFeedbackPage.tsx is a modal for adding feedback.
// It is used to add feedback to the database from the client.

import React, { useState } from "react";
import { feedbackService } from "./serviceFunctions/feedbackService";
import "./AddFeedbackPage.css";
import { createFeedback } from "./feedbackTypes/feedbackTypes";

interface AddFeedbackPageProps {
    onClose?: () => void;
    onFeedbackAdded?: () => void;
}

function AddFeedbackPage({ onClose, onFeedbackAdded }: AddFeedbackPageProps) {
    const [rating, setRating] = useState<number>(5);
    const [message, setMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    /**
     * Handles form submission and creates a Feedback object
     * @param e - Form submission event
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // Prevent the default form submission behavior.
        e.preventDefault();

        // Set the submitting state to true and clear any previous errors.
        setIsSubmitting(true);
        setError("");

        try {
            // Use the createFeedback utility function to ensure type safety
            const feedbackData = createFeedback(rating, message.trim());

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
            setError(err instanceof Error ? err.message : "Failed to submit feedback");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRating(parseInt(e.target.value));
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
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
                            onChange={handleRatingChange}
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
                            onChange={handleMessageChange}
                            placeholder="Share your feedback..."
                            rows={4}
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