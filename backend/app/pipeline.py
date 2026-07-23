import re
from typing import Optional
from sqlalchemy.orm import Session
from backend.app.models import Feedback, Issue
from backend.app.config import settings

class FeedbackPipeline:
    def __init__(self, db: Session):
        self.db = db

    def clean_text(self, text: str) -> str:
        # Standardize whitespace and strip html/markdown
        cleaned = re.sub(r'<[^>]*>', '', text)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        return cleaned

    def check_spam(self, text: str) -> bool:
        # Simple heuristics for spam
        spam_keywords = ["buy cheap", "make money online", "seo services", "test message", "asdfasdf"]
        text_lower = text.lower()
        if len(text_lower) < 10:
            return True
        for word in spam_keywords:
            if word in text_lower:
                return True
        return False

    def translate_text(self, text: str) -> (str, str):
        # Mock translations for demo purposes
        text_lower = text.lower()
        if "no funciona" in text_lower or "error de pago" in text_lower:
            return "Payment error, it does not work. Please fix.", "Spanish"
        if "le mot de passe" in text_lower or "connexion" in text_lower:
            return "Password and connection issues.", "French"
        return text, "English"

    def transcribe_audio(self, filename: str) -> dict:
        # Simulates Whispers speech-to-text with speaker separation
        return {
            "transcript": "Agent: Welcome to EchoOps Support. How can I help you?\nCustomer: Hi, I've been trying to check out for 20 minutes and it keeps crashing on the payment page. It says 'Error 500'. I'm really frustrated, I'm losing business!\nAgent: I am very sorry. Let me look into your checkout issue.",
            "speakers": [
                {"speaker": "Agent", "text": "Welcome to EchoOps Support. How can I help you?"},
                {"speaker": "Customer", "text": "Hi, I've been trying to check out for 20 minutes and it keeps crashing on the payment page. It says 'Error 500'. I'm really frustrated, I'm losing business!"},
                {"speaker": "Agent", "text": "I am very sorry. Let me look into your checkout issue."}
            ]
        }

    def analyze_sentiment(self, text: str, rating: Optional[int] = None) -> (str, float):
        text_lower = text.lower()
        score = 0.0
        
        # Simple lexicon-based sentiment
        negatives = ["crash", "fail", "broken", "horrible", "slow", "worst", "error", "hate", "annoying", "frustrated", "bug"]
        positives = ["love", "great", "awesome", "perfect", "good", "helpful", "fixed", "best", "thanks", "amazing"]
        
        for w in negatives:
            if w in text_lower:
                score -= 0.3
        for w in positives:
            if w in text_lower:
                score += 0.3
                
        # Factor in rating if available
        if rating is not None:
            if rating <= 2:
                score -= 0.5
            elif rating >= 4:
                score += 0.5
                
        score = max(-1.0, min(1.0, score))
        
        if score < -0.2:
            return "Negative", score
        elif score > 0.2:
            return "Positive", score
        return "Neutral", score

    def detect_emotion(self, text: str) -> str:
        text_lower = text.lower()
        if any(w in text_lower for w in ["crash", "furious", "hate", "worst", "cancel"]):
            return "Anger"
        if any(w in text_lower for w in ["frustrated", "annoying", "cannot", "fail", "stuck"]):
            return "Frustration"
        if any(w in text_lower for w in ["great", "love", "happy", "thanks", "perfect"]):
            return "Joy"
        if any(w in text_lower for w in ["sad", "sorry", "unfortunately", "lost"]):
            return "Sadness"
        return "Neutral"

    def extract_keywords(self, text: str) -> list:
        # Basic keyword extraction
        words = re.findall(r'\b[a-zA-Z]{4,}\b', text.lower())
        stopwords = {"this", "that", "with", "from", "have", "please", "your", "they", "will", "would", "could", "should", "about", "there", "their", "them"}
        keywords = [w for w in words if w not in stopwords]
        return list(set(keywords))

    def calculate_priority_and_health(self, sentiment_score: float, rating: Optional[int], meta_info: dict) -> (float, float):
        # Calculate Priority Score (0 to 100)
        # Higher score = more critical
        priority = 30.0  # Base
        
        if sentiment_score < 0:
            priority += abs(sentiment_score) * 40
        if rating and rating <= 2:
            priority += 20
        if meta_info.get("revenue_impact", 0) > 1000:
            priority += 20
            
        priority = min(100.0, max(0.0, priority))
        
        # Calculate Health Score (0 to 100)
        # Lower score = worse health
        health = 100.0
        if sentiment_score < 0:
            health -= abs(sentiment_score) * 50
        if rating:
            health -= (5 - rating) * 10
        if priority > 70:
            health -= 15
            
        health = min(100.0, max(0.0, health))
        return priority, health

    def find_or_create_issue(self, text: str, keywords: list, health_score: float, priority_score: float, meta_info: dict) -> Issue:
        # Semantic similarity matching (simple Jaccard similarity over keywords)
        text_lower = text.lower()
        all_issues = self.db.query(Issue).filter(Issue.status != "Closed").all()
        
        best_match = None
        best_score = 0.0
        
        for issue in all_issues:
            issue_words = set(self.extract_keywords(issue.title + " " + issue.summary))
            new_words = set(keywords)
            if not issue_words or not new_words:
                continue
            intersection = issue_words.intersection(new_words)
            union = issue_words.union(new_words)
            jaccard = len(intersection) / len(union)
            if jaccard > best_score:
                best_score = jaccard
                best_match = issue
                
        # If Jaccard overlap is above a threshold, attach to existing issue
        if best_match and best_score > 0.2:
            # Update existing issue metrics
            best_match.affected_users += 1
            best_match.total_reports += 1
            
            # Recalculate average rating & health score
            rating = meta_info.get("rating", 5)
            best_match.average_rating = (best_match.average_rating * (best_match.affected_users - 1) + rating) / best_match.affected_users
            best_match.health_score = min(best_match.health_score, health_score) # Keep the lowest (worst) health score
            
            # Recompute health status
            best_match.health_status = self.get_health_status_label(best_match.health_score)
            if priority_score > 75:
                best_match.priority = "Critical"
                
            self.db.commit()
            return best_match
            
        # Create new issue
        title = self.generate_issue_title(text, keywords)
        summary = f"AI generated issue summary based on customer feedback: {text[:150]}..."
        
        # Decide assigned team
        assigned_team = "Support"
        if any(w in text_lower for w in ["payment", "checkout", "charge", "refund", "card", "stripe", "billing"]):
            assigned_team = "Payments Engineering"
        elif any(w in text_lower for w in ["login", "password", "signup", "auth", "oauth", "token", "google"]):
            assigned_team = "Auth Team"
        elif any(w in text_lower for w in ["slow", "performance", "load", "crash", "hang", "freeze"]):
            assigned_team = "Platform Engineering"
        elif any(w in text_lower for w in ["ui", "layout", "color", "dark mode", "font", "css", "align"]):
            assigned_team = "UI/UX Product Team"
            
        new_issue = Issue(
            title=title,
            summary=summary,
            status="AI Verified",
            priority="Critical" if priority_score > 75 else ("High" if priority_score > 50 else "Medium"),
            health_score=health_score,
            health_status=self.get_health_status_label(health_score),
            assigned_team=assigned_team,
            root_cause="Heuristically identified issue in component system.",
            confidence=75.0,
            affected_users=1,
            total_reports=1,
            average_rating=float(meta_info.get("rating", 5)),
            affected_devices={meta_info.get("device", "Unknown"): 1},
            affected_countries={meta_info.get("country", "Unknown"): 1},
            affected_versions={meta_info.get("version", "1.0.0"): 1},
            platform_distribution={meta_info.get("platform", "Web"): 1},
            estimated_revenue_risk=float(meta_info.get("revenue_impact", 0.0)),
            estimated_churn_risk=0.15 if health_score < 50 else 0.02
        )
        self.db.add(new_issue)
        self.db.commit()
        self.db.refresh(new_issue)
        return new_issue

    def get_health_status_label(self, score: float) -> str:
        if score >= 90:
            return "Stable"
        elif score >= 75:
            return "Growing Slowly"
        elif score >= 60:
            return "Needs Attention"
        elif score >= 40:
            return "Critical"
        return "Business Critical"

    def generate_issue_title(self, text: str, keywords: list) -> str:
        # Generates a short descriptive title from keywords and text
        text_lower = text.lower()
        if "payment" in text_lower or "checkout" in text_lower:
            return "Payment Checkout Failure & Crash"
        if "login" in text_lower or "password" in text_lower:
            return "User Authentication & Password Reset Failures"
        if "slow" in text_lower or "lag" in text_lower:
            return "Performance Degradation on Mobile Devices"
        if "dark mode" in text_lower:
            return "Feature Request: Dark Mode Support"
        
        # Fallback to keyword assembly
        relevant_words = [w.capitalize() for w in keywords[:3]]
        if len(relevant_words) > 0:
            return f"Issue relating to {' '.join(relevant_words)}"
        return "Unclassified Feedback Issue"

    def process_feedback(self, text: str, source: str, meta_info: dict, audio_path: str = None) -> Feedback:
        # 1. Clean Data
        cleaned = self.clean_text(text)
        
        # 2. Check Spam
        is_spam = self.check_spam(cleaned)
        
        # 3. Translate
        translated_text, lang = self.translate_text(cleaned)
        
        # 4. Transcribe (if audio)
        transcript = None
        if audio_path:
            transcription_res = self.transcribe_audio(audio_path)
            translated_text = transcription_res["transcript"]
            transcript = transcription_res["transcript"]
            
        # 5. Sentiment
        rating = meta_info.get("rating")
        sentiment, sentiment_score = self.analyze_sentiment(translated_text, rating)
        
        # 6. Emotion
        emotion = self.detect_emotion(translated_text)
        
        # 7. Keywords
        keywords = self.extract_keywords(translated_text)
        
        # 8 & 9. Health & Priority Score
        priority_score, health_score = self.calculate_priority_and_health(sentiment_score, rating, meta_info)
        
        # 10. Find or create issue (if not spam)
        issue_id = None
        if not is_spam:
            issue = self.find_or_create_issue(translated_text, keywords, health_score, priority_score, meta_info)
            issue_id = issue.id
            
        # Create database entry
        fb = Feedback(
            source=source,
            original_text=text,
            cleaned_text=cleaned,
            is_spam=is_spam,
            language=lang,
            transcript=transcript,
            sentiment=sentiment,
            sentiment_score=sentiment_score,
            emotion=emotion,
            priority_score=priority_score,
            health_score=health_score,
            meta_info=meta_info,
            issue_id=issue_id
        )
        self.db.add(fb)
        self.db.commit()
        self.db.refresh(fb)
        return fb
