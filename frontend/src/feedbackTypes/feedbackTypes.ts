// TypeScript definitions for feedback types

export interface Feedback {
    rating: number;
    message: string;
    id?: number;
    created_at?: string;
}

/**
 * Validates if an object matches the Feedback interface
 * @param obj - The object to validate
 * @returns True if the object is a valid Feedback
 */
export function isValidFeedback(obj: any): obj is Feedback {
    return (
        obj &&
        typeof obj === 'object' &&
        typeof obj.rating === 'number' &&
        obj.rating >= 1 &&
        obj.rating <= 5 &&
        typeof obj.message === 'string'
    );
}

/**
 * Creates a Feedback object with validation
 * @param rating - The rating value (1-5)
 * @param message - The feedback message
 * @returns A valid Feedback object
 * @throws Error if the parameters are invalid
 */
export function createFeedback(rating: number, message: string = ''): Feedback {
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        throw new Error('Rating must be a number between 1 and 5');
    }

    if (typeof message !== 'string') {
        throw new Error('Message must be a string');
    }

    return {
        rating: Math.floor(rating), // Ensure it's an integer
        message: message.trim()
    };
} 