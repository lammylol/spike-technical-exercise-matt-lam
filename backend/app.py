# app.py - Mock Flask backend (with bugs)
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import logging

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def init_db():
    # Initialize the database and create tables if they don't exist.
    # This checks if it exists and creates it if it doesn't.
    conn = sqlite3.connect("feedback.db")
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            rating INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """
    )
    conn.commit()
    conn.close()


@app.route("/feedback", methods=["GET"])
def get_feedback():
    try:
        logger.info("GET /feedback - Fetching feedback")
        init_db()
        conn = sqlite3.connect("feedback.db")
        cursor = conn.cursor()
        rating = request.args.get("rating")
        sort = request.args.get("sort", "desc")
        query = "SELECT * FROM feedback"

        if rating:
            logger.info(f"Filtering by rating: {rating}")
            query += f" WHERE rating = {rating}"  # <-- SQL injection risk
        query += f" ORDER BY created_at {sort}"

        logger.info(f"Executing query: {query}")
        feedback = cursor.execute(query).fetchall()
        logger.info(f"Found {len(feedback)} feedback entries")
        conn.close()
        return jsonify(feedback)
    except Exception as e:
        logger.error(f"Error fetching feedback: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/feedback", methods=["POST"])
def post_feedback():
    try:
        logger.info("POST /feedback - Submitting new feedback")
        init_db()
        data = request.get_json()
        logger.info(f"Received feedback data: {data}")

        conn = sqlite3.connect("feedback.db")
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO feedback (message, rating) VALUES (?, ?)",
            (data["message"], data["rating"]),
        )
        conn.commit()
        logger.info(
            f"Successfully saved feedback: rating={data['rating']}, message='{data['message'][:50]}...'"
        )
        conn.close()
        return jsonify({"status": "ok"})
    except Exception as e:
        logger.error(f"Error submitting feedback: {str(e)}")
        return jsonify({"error": str(e)}), 500


# Run the app. This is essential for the entry point for the backend.
if __name__ == "__main__":
    app.run(debug=True, port=5001)
