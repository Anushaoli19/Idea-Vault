from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


SIMILARITY_THRESHOLD = 0.40


def extract_idea_text(item):
    """Helper to extract searchable content from either string or dictionary."""
    if isinstance(item, dict):
        title = item.get("title", "")
        desc = item.get("description", "")
        return f"{title} {desc}".strip()
    return str(item).strip()


def detect_duplicate(new_idea, existing_ideas):
    if not existing_ideas:
        return {
            "is_duplicate": False,
            "message": "No existing ideas found.",
            "similarity_score": 0,
            "similar_idea": None
        }

    descriptions = [
        extract_idea_text(idea) for idea in existing_ideas
    ]

    descriptions.append(extract_idea_text(new_idea))

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(descriptions)

    similarity_scores = cosine_similarity(
        tfidf_matrix[-1],
        tfidf_matrix[:-1]
    )[0]

    best_index = similarity_scores.argmax()
    best_score = float(similarity_scores[best_index])

    best_match = existing_ideas[best_index]

    is_duplicate = best_score >= SIMILARITY_THRESHOLD

    return {
        "is_duplicate": is_duplicate,
        "message": (
            "A similar idea already exists!"
            if is_duplicate
            else "No similar idea found."
        ),
        "similarity_score": round(best_score * 100, 2),
        "similar_idea": best_match if is_duplicate else None
    }


if __name__ == "__main__":
    existing_ideas = [
        {
            "id": 1,
            "title": "Smart Parking System",
            "description": "A smart parking system for colleges to find available parking spaces."
        },
        {
            "id": 2,
            "title": "Online Library Management",
            "description": "A digital platform to manage library books and student borrowing."
        }
    ]

    new_idea = "A college parking application to locate free parking spaces."
    result = detect_duplicate(new_idea, existing_ideas)

    print("\nDUPLICATE IDEA DETECTION")
    print("-----------------------")
    print("New Idea:", new_idea)
    print("Duplicate:", result["is_duplicate"])
    print("Similarity Score:", result["similarity_score"], "%")
    print("Message:", result["message"])
    print("Similar Idea:", result["similar_idea"])
