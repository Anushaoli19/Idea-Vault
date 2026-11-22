# Idea Vault – Backend

## Project Description
Idea Vault is a web application for NIE students to share project ideas, discover existing ideas, upvote ideas, and express interest in joining projects.

## My Role – Person 1
Backend Development and Duplicate Detection.

## Technologies Used
- Python
- Flask
- SQLite
- Scikit-learn
- TF-IDF
- Cosine Similarity

## Features
1. Submit new project ideas.
2. Detect duplicate and similar ideas.
3. Display all submitted ideas.
4. Record student upvotes.
5. Prevent duplicate upvotes.
6. Allow students to express interest in ideas.
7. Prevent duplicate interest entries.
8. Display upvote and interested student counts.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/ideas` | Submit an idea and check duplicates |
| GET | `/ideas` | Retrieve all ideas |
| POST | `/ideas/<id>/upvote` | Upvote an idea |
| POST | `/ideas/<id>/interest` | Express interest in an idea |

## Duplicate Detection
TF-IDF converts idea descriptions into numerical vectors. Cosine similarity compares a new idea with existing ideas to identify similar submissions.

The current similarity threshold is 40%.

## How to Run

1. Install Python.
2. Create and activate a virtual environment.
3. Install dependencies:

   `pip install -r requirements.txt`

4. Run the backend:

   `python app.py`

5. The backend runs locally at:

   `http://127.0.0.1:5000`

## Testing
The backend was tested for:
- New idea submission.
- Duplicate idea detection.
- Upvote functionality.
- Duplicate upvote prevention.
- Interest functionality.
- Duplicate interest prevention.
- Retrieving ideas and their counts.