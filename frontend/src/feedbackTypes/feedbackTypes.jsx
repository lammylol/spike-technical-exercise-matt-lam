// This is a type definition for the feedback object.
/**
 * @typedef {Object} Feedback
 * @property {number} rating - The rating value (1-5)
 * @property {string} message - The feedback message
 */

/**
 * Validates if an object matches the Feedback type
 * @param {any} obj
 * @returns {boolean}
 */
export function isValidFeedback(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.rating === "number" &&
    obj.rating >= 1 &&
    obj.rating <= 5 &&
    typeof obj.message === "string"
  );
}

/**
 * Creates a Feedback object with validation
 * @param {number} rating
 * @param {string} message
 * @returns {Feedback}
 * @throws {Error}
 */
export function createFeedback(rating, message = "") {
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    throw new Error("Rating must be a number between 1 and 5");
  }

  if (typeof message !== "string") {
    throw new Error("Message must be a string");
  }

  return {
    rating: Math.floor(rating), // Ensure it's an integer
    message: message.trim(),
  };
}
