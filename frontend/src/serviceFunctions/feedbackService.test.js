// This is a jest test file for the feedbackService functions.

import { feedbackService } from "./feedbackService";

// Mock fetch globally
global.fetch = jest.fn();

describe("feedbackService", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    fetch.mockClear();
  });

  describe("getFeedback", () => {
    it("should fetch feedback without rating filter", async () => {
      const mockFeedback = [
        { rating: 5, message: "Great service!" },
        { rating: 4, message: "Good experience" },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFeedback,
      });

      const result = await feedbackService.getFeedback();

      expect(fetch).toHaveBeenCalledWith("/feedback?");
      expect(result).toEqual(mockFeedback);
    });

    it("should fetch feedback with rating filter", async () => {
      const mockFeedback = [{ rating: 5, message: "Great service!" }];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFeedback,
      });

      const result = await feedbackService.getFeedback(5);

      expect(fetch).toHaveBeenCalledWith("/feedback?rating=5");
      expect(result).toEqual(mockFeedback);
    });

    it("should throw error when rating filter is 0", async () => {
      await expect(feedbackService.getFeedback(0)).rejects.toThrow(
        "Rating must be between 1 and 5"
      );

      expect(fetch).not.toHaveBeenCalled();
    });

    it("should throw error when fetch fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(feedbackService.getFeedback()).rejects.toThrow(
        "Failed to fetch feedback"
      );
    });
  });

  describe("submitFeedback", () => {
    it("should submit feedback successfully", async () => {
      const feedbackData = {
        rating: 5,
        message: "Excellent service!",
      };

      const mockResponse = {
        id: 1,
        rating: 5,
        message: "Excellent service!",
        created_at: "2024-01-01T00:00:00Z",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await feedbackService.submitFeedback(feedbackData);

      expect(fetch).toHaveBeenCalledWith("/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });
      expect(result).toEqual(mockResponse);
    });

    it("should submit feedback with rating but no message data", async () => {
      const feedbackData = {
        rating: 3,
      };

      const mockResponse = {
        id: 1,
        rating: 3,
        message: null,
        created_at: "2024-01-01T00:00:00Z",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await feedbackService.submitFeedback(feedbackData);

      expect(fetch).toHaveBeenCalledWith("/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when submission fails", async () => {
      const feedbackData = {
        rating: 5,
        message: "Test comment",
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });

      await expect(
        feedbackService.submitFeedback(feedbackData)
      ).rejects.toThrow("Failed to submit feedback");
    });

    it("should throw error when missing rating data", async () => {
      const feedbackData = {};

      await expect(
        feedbackService.submitFeedback(feedbackData)
      ).rejects.toThrow("Feedback requires at least a rating");
    });
  });
});
