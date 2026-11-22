# Idea Vault – Backend API Documentation

**Backend Framework:** Python Flask  
**Database:** SQLite  
**Base URL:** `http://127.0.0.1:5000`

## 1. Submit a New Idea

**Method:** POST  
**Endpoint:** `/ideas`

Request Body:
```json
{
  "title": "Smart Parking System",
  "description": "A smart parking system for colleges.",
  "category": "Technology"
}
```

Successful Response:
```json
{
  "message": "Idea submitted successfully!",
  "idea_id": 1,
  "duplicate": false
}
```

If a similar idea exists, the API returns HTTP 409 with a warning, similarity score, and matching idea.

## 2. Get All Ideas

**Method:** GET  
**Endpoint:** `/ideas`

Returns all submitted ideas, including:
- Idea ID
- Title
- Description
- Category
- Upvote count
- Interested student count

## 3. Upvote an Idea

**Method:** POST  
**Endpoint:** `/ideas/<idea_id>/upvote`

Request Body:
```json
{
  "student_id": "student101"
}
```

Prevents the same student from upvoting the same idea more than once.

## 4. Express Interest

**Method:** POST  
**Endpoint:** `/ideas/<idea_id>/interest`

Request Body:
```json
{
  "student_id": "student102"
}
```

Prevents duplicate interest entries from the same student.

## 5. Duplicate Detection

The backend uses:
- TF-IDF (Term Frequency–Inverse Document Frequency)
- Cosine Similarity

The current similarity threshold is 40%.

When a submitted idea reaches the threshold, the backend returns a duplicate warning, similarity percentage, and matching existing idea.

## Integration Notes

- The frontend should send requests using JSON.
- Set the request header to `Content-Type: application/json`.
- Handle HTTP 409 responses for duplicate ideas, repeated upvotes, and repeated interest.
- During local development, use the base URL `http://127.0.0.1:5000`.
- The base URL must be changed when the complete application is deployed.