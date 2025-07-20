// Data service functions for feedback API

const API_BASE_URL = "/feedback";

export const feedbackService = {
  // Get feedback with optional rating filter
  getFeedback: async (rating = null) => {
    // Validate rating if provided
    if (rating !== null && (rating < 1 || rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    const params = new URLSearchParams();
    if (rating !== null) {
      params.append("rating", rating);
    }

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch feedback: ${response.statusText}`);
    }
    return response.json();
  },

  // Submit new feedback
  submitFeedback: async (feedbackData) => {
    // Typeguard for feedbackData.
    // This is a simple check to ensure the feedbackData is valid. Could enhance with more robust type checking.
    if (!feedbackData.rating) {
      throw new Error("Feedback requires at least a rating");
    }

    if (feedbackData.rating < 1 || feedbackData.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit feedback: ${response.statusText}`);
    }

    return response.json();
  },
};
