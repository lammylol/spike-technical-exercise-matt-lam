# Full-Stack Debug & Feature Test

Welcome! This is a full-stack take-home test. The app is partially functional and contains a few bugs. Your task:

1. Debug and fix the application so it runs correctly.
2. Implement filtering and sorting of feedback by rating and date.
3. Refactor any part of the code you find necessary.
4. Add appropriate test coverage.

## How to Run

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Reset - If encountering venv errors
```bash
deactivate  # Leave the virtual environment if active
rm -rf venv
# then run the ### Backend ones again.
```

### Frontend

```bash
cd frontend
# ensure no package-lock.json exists, only package.json. If not, remove package-lock.json.
yarn install
yarn start
```

## Testing

### Frontend Tests

The frontend includes comprehensive test coverage for the feedback service functions.

#### Running Tests

```bash
cd frontend
yarn test
```

#### Test Coverage

- **feedbackService.test.js**: Tests for the feedback API service functions
  - `getFeedback()`: Tests fetching feedback with and without rating filters
  - `submitFeedback()`: Tests submitting new feedback with validation
  - Error handling for invalid ratings, network errors, and API failures

## Submission

Push your changes to GitHub and send us the link. Include notes in a PR or README on:

- Bugs you fixed
- Design decisions you made
- Any improvements/refactors
