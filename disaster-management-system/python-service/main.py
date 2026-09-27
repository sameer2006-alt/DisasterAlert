import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from nlp_engine import analyze_post
from severity import calculate_severity


# ==========================================
# APP
# ==========================================

app = FastAPI(
    title="CodeRizz Social Media Intelligence API",
    description="NLP service for disaster-related social media analysis",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# DATA
# ==========================================

DATA_PATH = (
    Path(__file__).parent
    / "data"
    / "social_posts.json"
)


# ==========================================
# REQUEST MODEL
# ==========================================

class PostRequest(BaseModel):
    text: str


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():

    return {
        "project": "CodeRizz",
        "module": "Social Media Intelligence",
        "status": "running"
    }


# ==========================================
# ANALYZE ONE POST
# ==========================================

@app.post("/api/analyze")
def analyze_new_post(post: PostRequest):

    result = analyze_post(
        post.text
    )

    result["severity"] = calculate_severity(
        result["emergency_score"]
    )

    return result


@app.get("/api/health")
def health_check():

    return {
        "status": "healthy",
        "service": "CodeRizz NLP",
        "version": "1.0.0"
    }


# ==========================================
# ANALYZE ALL SAMPLE POSTS
# ==========================================

@app.get("/api/posts")
def get_posts():

    with open(
        DATA_PATH,
        "r",
        encoding="utf-8"
    ) as file:

        posts = json.load(file)

    alerts = []

    for post in posts:

        result = analyze_post(
            post["text"]
        )

        result["id"] = post["id"]

        result["severity"] = calculate_severity(
            result["emergency_score"]
        )

        alerts.append(result)

    return {
        "count": len(alerts),
        "alerts": alerts
    }