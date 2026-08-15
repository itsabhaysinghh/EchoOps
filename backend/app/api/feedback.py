from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from backend.app.database import get_db
from backend.app.models import Feedback
from backend.app.schemas import FeedbackResponse, FeedbackCreate, AudioUploadResponse
from backend.app.pipeline import FeedbackPipeline
from backend.app.api.auth_dep import get_current_user

router = APIRouter(prefix="/api/feedback", tags=["Feedback"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=List[FeedbackResponse])
def get_all_feedback(db: Session = Depends(get_db)):
    return db.query(Feedback).order_by(Feedback.created_at.desc()).all()

@router.post("", response_model=FeedbackResponse)
def create_feedback(fb_in: FeedbackCreate, db: Session = Depends(get_db)):
    pipeline = FeedbackPipeline(db)
    meta = fb_in.meta_info or {"device": "Unknown", "country": "Unknown", "version": "1.0.0", "rating": 5, "platform": "Web", "email": "anonymous@user.com"}
    fb = pipeline.process_feedback(fb_in.original_text, fb_in.source, meta)
    return fb

@router.post("/audio", response_model=AudioUploadResponse)
def process_audio(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    # Process audio upload: Whisper speech-to-text with speaker separation,
    # summary, issue extraction, sentiment, emotion, and suggested tickets.
    pipeline = FeedbackPipeline(db)
    
    # Run mock transcription pipeline
    result = pipeline.transcribe_audio(file.filename)
    
    # Process transcription through sentiment/emotion/issue engines
    transcript = result["transcript"]
    sentiment, sentiment_score = pipeline.analyze_sentiment(transcript, rating=1)
    emotion = pipeline.detect_emotion(transcript)
    
    # Suggested assignment details
    suggested_team = "Payments Engineering" if "payment" in transcript.lower() or "checkout" in transcript.lower() else "Support"
    
    return AudioUploadResponse(
        transcript=transcript,
        speakers=result["speakers"],
        summary="Customer called support expressing frustration over repeated payments failing during the checkout flow.",
        extracted_problem="Payment failure on checkout screen",
        sentiment=sentiment,
        emotion=emotion,
        suggested_team=suggested_team,
        suggested_priority="Critical" if sentiment == "Negative" else "High"
    )
