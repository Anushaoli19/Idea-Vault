from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

SIMILARITY_THRESHOLD = 0.40  # 40% similarity threshold


def preprocess_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    return ' '.join(text.split())


def detect_duplicate(new_title: str, new_description: str, existing_ideas: list, threshold: float = SIMILARITY_THRESHOLD) -> dict:
    """
    Evaluates whether a new project idea is semantically similar to existing proposals.
    Evaluates description similarity and combined title+description overlap, taking the maximum.
    """
    if not existing_ideas:
        return {
            "is_duplicate": False,
            "message": "No existing project ideas found to compare against.",
            "similarity_score": 0.0,
            "similar_idea": None,
            "threshold": round(threshold * 100, 1)
        }

    # Prepare description corpus and combined corpus
    valid_ideas = []
    desc_corpus = []
    combined_corpus = []

    for idea in existing_ideas:
        title = idea.get("title", "")
        desc = idea.get("description", "") or idea.get("problem_statement", "")
        if desc.strip() or title.strip():
            desc_corpus.append(preprocess_text(desc))
            combined_corpus.append(preprocess_text(f"{title} {desc}"))
            valid_ideas.append(idea)

    if not valid_ideas or not (new_description.strip() or new_title.strip()):
        return {
            "is_duplicate": False,
            "message": "Insufficient text provided to evaluate similarity.",
            "similarity_score": 0.0,
            "similar_idea": None,
            "threshold": round(threshold * 100, 1)
        }

    # Target queries
    target_desc = preprocess_text(new_description)
    target_combined = preprocess_text(f"{new_title} {new_description}")

    # Compute similarity across descriptions
    desc_corpus.append(target_desc)
    vectorizer_desc = TfidfVectorizer(stop_words="english", sublinear_tf=True)
    tfidf_desc = vectorizer_desc.fit_transform(desc_corpus)
    desc_similarities = cosine_similarity(tfidf_desc[-1], tfidf_desc[:-1])[0]

    # Compute similarity across combined title + description
    combined_corpus.append(target_combined)
    vectorizer_comb = TfidfVectorizer(stop_words="english", sublinear_tf=True)
    tfidf_comb = vectorizer_comb.fit_transform(combined_corpus)
    comb_similarities = cosine_similarity(tfidf_comb[-1], tfidf_comb[:-1])[0]

    # Find maximum similarity across either metric
    best_score = 0.0
    best_index = 0
    for idx in range(len(valid_ideas)):
        score = max(float(desc_similarities[idx]), float(comb_similarities[idx]))
        if score > best_score:
            best_score = score
            best_index = idx

    best_match = valid_ideas[best_index]
    is_dup = best_score >= threshold
    similarity_percentage = round(best_score * 100, 1)

    return {
        "is_duplicate": is_dup,
        "similarity_score": similarity_percentage,
        "threshold": round(threshold * 100, 1),
        "message": (
            f"High similarity detected ({similarity_percentage}%). This proposal closely resembles '{best_match.get('title')}'."
            if is_dup
            else f"Unique idea! Highest match score is {similarity_percentage}% (below {round(threshold * 100, 1)}% threshold)."
        ),
        "similar_idea": {
            "id": best_match.get("id"),
            "title": best_match.get("title"),
            "category": best_match.get("category"),
            "department": best_match.get("department"),
            "description": best_match.get("description"),
            "author_name": best_match.get("author_name", "NIE Student"),
            "author_batch": best_match.get("author_batch", "Class of 2025")
        } if is_dup else None
    }
