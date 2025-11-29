import os
from dotenv import load_dotenv

load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid
import logging

# Services
from services.supabase_client import supabase
from services.storage import upload_audio_base64
from services.utils import calculate_phq9_score_and_severity

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "https://fydp-2-website-dataset-detection.vercel.app",
            "https://*.vercel.app"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

# Config
ASSESSMENTS_TABLE = os.getenv("ASSESSMENTS_TABLE", "voice_assessments")
PORT = int(os.getenv("PORT", 5000))


def _safe_get_response_data(res):
    """Safely extract data from Supabase response"""
    if res is None:
        return None
    if hasattr(res, "data"):
        return res.data
    if isinstance(res, dict):
        return res.get("data")
    return None


@app.route("/")
def index():
    """Root endpoint - API information"""
    return jsonify({
        "message": "EchoMind AI - Voice-Based Depression Detection API",
        "status": "online",
        "version": "1.0.0",
        "endpoints": {
            "/api/health": "GET - Health check",
            "/api/stats": "GET - Dashboard statistics",
            "/api/submit_test": "POST - Submit voice assessment",
            "/api/assessment/<id>": "GET - Get specific assessment",
            "/api/assessments": "GET - List all assessments"
        }
    }), 200


@app.route("/api/health")
def health():
    """Health check endpoint"""
    try:
        # Test database connection
        res = supabase.table(ASSESSMENTS_TABLE).select("id", count="exact").limit(1).execute()
        
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }), 500


@app.route('/api/stats')
def get_stats():
    """
    GET /api/stats
    Returns aggregate statistics for dashboard
    """
    try:
        response = supabase.table(ASSESSMENTS_TABLE).select('*').execute()
        data = response.data or []

        total_tests = len(data)
        total_audio = sum(1 for d in data if d.get('audio_path') or d.get('has_audio'))
        
        # Calculate average PHQ-9 score
        avg_phq9 = 0
        if total_tests > 0:
            total_score = sum(d.get('phq9_total_score', 0) for d in data)
            avg_phq9 = round(total_score / total_tests, 2)

        # Gender distribution
        male = sum(1 for d in data if (d.get('gender') or '').lower() == 'male')
        female = sum(1 for d in data if (d.get('gender') or '').lower() == 'female')
        male_percent = round((male / total_tests) * 100, 1) if total_tests > 0 else 0
        female_percent = round((female / total_tests) * 100, 1) if total_tests > 0 else 0

        # Severity distribution
        severity_counts = {
            "minimal": 0, 
            "mild": 0, 
            "moderate": 0, 
            "moderately-severe": 0, 
            "severe": 0
        }
        
        for d in data:
            sev = (d.get("severity") or "minimal").lower()
            if sev in severity_counts:
                severity_counts[sev] += 1

        status_distribution = [
            {
                "name": "সর্বনিম্ন (0-4)", 
                "value": round((severity_counts["minimal"] / total_tests) * 100, 1) if total_tests > 0 else 0
            },
            {
                "name": "সামান্য (5-9)", 
                "value": round((severity_counts["mild"] / total_tests) * 100, 1) if total_tests > 0 else 0
            },
            {
                "name": "মাঝারি (10-14)", 
                "value": round((severity_counts["moderate"] / total_tests) * 100, 1) if total_tests > 0 else 0
            },
            {
                "name": "মাঝারি থেকে গুরুতর (15-19)", 
                "value": round((severity_counts["moderately-severe"] / total_tests) * 100, 1) if total_tests > 0 else 0
            },
            {
                "name": "গুরুতর (20-24)", 
                "value": round((severity_counts["severe"] / total_tests) * 100, 1) if total_tests > 0 else 0
            },
        ]

        # Age distribution
        age_groups = {"18-24": 0, "25-34": 0, "35-44": 0, "45-54": 0, "55+": 0}
        for d in data:
            try:
                age = int(d.get("age", 0))
                if 18 <= age <= 24:
                    age_groups["18-24"] += 1
                elif 25 <= age <= 34:
                    age_groups["25-34"] += 1
                elif 35 <= age <= 44:
                    age_groups["35-44"] += 1
                elif 45 <= age <= 54:
                    age_groups["45-54"] += 1
                else:
                    age_groups["55+"] += 1
            except:
                continue

        age_distribution = [{"ageGroup": k, "count": v} for k, v in age_groups.items()]

        return jsonify({
            "totalTests": total_tests,
            "totalAudio": total_audio,
            "averagePhq9": avg_phq9,
            "malePercent": male_percent,
            "femalePercent": female_percent,
            "statusDistribution": status_distribution,
            "ageDistribution": age_distribution
        }), 200

    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/submit_test", methods=["POST"])
def submit_test():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "invalid_json"}), 400

        # Get consent (accept both field names for compatibility)
        consent = data.get("consent") or data.get("consentData") or {}

        # Validate required fields
        required = [
            "age", "gender", "currentMedication", "recordingEnvironment", 
            "languageDialect", "question1", "question2", "question3", 
            "question4", "question5", "question6", "question7", "question8", "question9",
            "audioData"
        ]
        
        for field in required:
            if field not in data:
                logger.warning(f"Missing required field: {field}")
                return jsonify({"error": f"missing_{field}"}), 400

        # Validate age
        try:
            age = int(data.get("age"))
            if age < 18:
                return jsonify({"error": "age_must_be_18_or_over"}), 400
        except:
            return jsonify({"error": "age_must_be_integer"}), 400

        # Validate consent fields
        consent_required_fields = [
            "voluntary",           # ক. স্বায়ত্তশাসন এবং নিয়ন্ত্রণ
            "dataAnonymization",
            "optOut",
            "ageConfirm",
            "nonDiagnostic",       # খ. উদ্দেশ্য এবং তথ্যের ব্যবহার
            "dataType",
            "sdeStorage",          # গ. আপনার তথ্যের সুরক্ষা (SDE পদ্ধতি)
            "pseudonymization",
            "accessControl",
            "futureResearch",
            "dataRetention"
        ]
        
        for cf in consent_required_fields:
            if not consent.get(cf, False):
                logger.warning(f"Consent not provided: {cf}")
                return jsonify({"error": f"consent_required_{cf}"}), 400

        # Calculate PHQ-9 score and severity
        phq_answers = {f"question{i}": data.get(f"question{i}") for i in range(1, 10)}
        score, severity = calculate_phq9_score_and_severity(phq_answers)

        # Generate unique assessment ID
        assessment_id = str(uuid.uuid4())

        # Upload audio to storage
        audio_base64 = data.get("audioData")
        storage_path, signed_url = None, None
        
        if audio_base64:
            try:
                logger.info(f"Uploading audio for assessment: {assessment_id}")
                storage_path, signed_url = upload_audio_base64(assessment_id, audio_base64)
                logger.info(f"✓ Audio uploaded: {bool(storage_path)}, URL: {bool(signed_url)}")
            except Exception as e:
                logger.error(f"Audio upload error: {e}")
                # Continue without audio - don't block submission
                storage_path, signed_url = None, None

        # Prepare assessment record
        record = {
            "id": assessment_id,
            "full_name": data.get("fullName") or None,
            "age": age,
            "gender": data.get("gender"),
            "current_medication": data.get("currentMedication"),
            "recording_environment": data.get("recordingEnvironment"),
            "language_dialect": data.get("languageDialect"),
            
            # PHQ-9 responses
            "question1": int(data.get("question1")),
            "question2": int(data.get("question2")),
            "question3": int(data.get("question3")),
            "question4": int(data.get("question4")),
            "question5": int(data.get("question5")),
            "question6": int(data.get("question6")),
            "question7": int(data.get("question7")),
            "question8": int(data.get("question8")),
            "question9": int(data.get("question9")),

            
            # Calculated values
            "phq9_total_score": score,
            "severity": severity,
            
            # Consent
            "consent_data": consent,
            
            # Audio
            "audio_path": storage_path,
            "audio_url": signed_url,
            "has_audio": bool(signed_url),
            
            # Status
            "status": "submitted",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }

        # Insert to database
        logger.info(f"Inserting assessment to database: {assessment_id}")
        insert_res = supabase.table(ASSESSMENTS_TABLE).insert(record).execute()

        # Log success
        logger.info("=" * 60)
        logger.info("✓ Assessment submitted successfully")
        logger.info(f"  Assessment ID: {assessment_id}")
        logger.info(f"  Name: {data.get('fullName', 'Anonymous')}")
        logger.info(f"  Age: {age} | Gender: {data.get('gender')}")
        logger.info(f"  PHQ-9 Score: {score} | Severity: {severity}")
        logger.info(f"  Audio: {bool(storage_path)}")
        logger.info(f"  Audio URL: {signed_url[:50] if signed_url else 'None'}...")
        logger.info(f"  Timestamp: {datetime.utcnow().isoformat()}")
        logger.info("=" * 60)

        return jsonify({
        "testId": assessment_id,
        "audioUrl": signed_url,
        "audio_url": signed_url,
        "status": "submitted",
        "phq9Score": score,
        "severity": severity,
        "hasAudio": bool(signed_url)
        }), 201


    except Exception as e:
        logger.error(f"Error submitting assessment: {e}", exc_info=True)
        return jsonify({
            "error": "server_error",
            "details": str(e)
        }), 500


@app.route("/api/assessment/<aid>")
def get_assessment(aid):
    """Get a specific assessment by ID"""
    try:
        res = supabase.table(ASSESSMENTS_TABLE).select("*").eq("id", aid).execute()
        rows = _safe_get_response_data(res) or []
        
        if not rows:
            return jsonify({"error": "not_found"}), 404
            
        return jsonify(rows[0]), 200
        
    except Exception as e:
        logger.error(f"Error fetching assessment: {e}")
        return jsonify({"error": "server_error", "details": str(e)}), 500


@app.route("/api/assessments")
def all_assessments():
    """List all assessments with pagination"""
    try:
        limit = int(request.args.get("limit", 50))
        offset = int(request.args.get("offset", 0))
        
        res = supabase.table(ASSESSMENTS_TABLE)\
            .select("*")\
            .order("created_at", desc=True)\
            .range(offset, offset + limit - 1)\
            .execute()
            
        rows = _safe_get_response_data(res) or []
        
        return jsonify({
            "assessments": rows,
            "count": len(rows),
            "limit": limit,
            "offset": offset
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching assessments: {e}")
        return jsonify({"error": "server_error", "details": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'production') != 'production'
    
    logger.info("=" * 60)
    logger.info("EchoMind AI - Flask API Server")
    logger.info("=" * 60)
    logger.info(f"Environment: {'Development' if debug else 'Production'}")
    logger.info(f"Port: {port}")
    logger.info(f"Database Table: {ASSESSMENTS_TABLE}")
    logger.info("=" * 60)
    
    app.run(debug=debug, host='0.0.0.0', port=port)