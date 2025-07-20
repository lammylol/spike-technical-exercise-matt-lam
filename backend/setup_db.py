import sqlite3


def setup_database():
    """Create the database and tables with sample data"""
    conn = sqlite3.connect("feedback.db")
    cursor = conn.cursor()

    # Create the feedback table
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

    # Insert sample feedback data
    sample_data = [
        ("Great service! Very helpful staff.", 5),
        ("The product quality is excellent.", 5),
        ("Good experience overall.", 4),
        ("Could be better, but not bad.", 3),
        ("Disappointed with the service.", 2),
        ("Terrible experience, would not recommend.", 1),
        ("Fast delivery and good communication.", 4),
        ("The website is easy to use.", 5),
        ("Average experience, nothing special.", 3),
        ("Outstanding customer support!", 5),
    ]

    cursor.executemany(
        "INSERT INTO feedback (message, rating) VALUES (?, ?)", sample_data
    )

    conn.commit()
    conn.close()
    print("Database setup complete! Sample data inserted.")


if __name__ == "__main__":
    setup_database()
