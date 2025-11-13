import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid
from dotenv import load_dotenv

# services
from services.supabase_client import supabase
from services.storage import upload_audio_base64
from services.utils import calculate_phq8_score_and_severity

load_dotenv()

app = Flask(__name__)
CORS(app)

# config
ASSESSMENTS_TABLE = os.getenv("ASSESSMENTS_TABLE", "voice_assessments")
PORT = int(os.getenv("PORT", 5000))


def _safe_get_response_data(res):
    if res is None:
        return None
    if hasattr(res, "data"):
        return res.data
    if isinstance(res, dict):
        return res.get("data")
    return None


@app.route("/")
def index():
    return jsonify({
        "message": "EchoMind AI - backend",
        "status": "online",
        "endpoints": {
            "/api/health": "GET",
            "/api/stats": "GET",
            "/api/submit_test": "POST",
            "/api/assessment/<id>": "GET",
            "/api/assessments": "GET"
        }
    })


@app.route("/api/health")
def health():
    try:
        res = supabase.table(ASSESSMENTS_TABLE).select("id", count="exact").limit(1).execute()
        return jsonify({"status": "healthy", "db": "connected", "timestamp": datetime.utcnow().isoformat()}), 200
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500


# @app.route("/api/stats")
# def stats():
#     """
#     Return aggregated stats used by frontend.
#     Response shape:
#     {
#       totalTests,
#       statusDistribution: [{name, value(percent)}...],
#       ageDistribution: [{ageGroup, count}...]
#     }
#     """
#     try:
#         res = supabase.table(ASSESSMENTS_TABLE).select("*").execute()
#         rows = _safe_get_response_data(res) or []
#         total_tests = len(rows)
#         if total_tests == 0:
#             return jsonify({
#                 "totalTests": 0,
#                 "statusDistribution": [
#                   {"name": "সর্বনিম্ন (0-4)", "value": 0},
#                   {"name": "সামান্য (5-9)", "value": 0},
#                   {"name": "মাঝারি (10-14)", "value": 0},
#                   {"name": "মাঝারি থেকে গুরুতর (15-19)", "value": 0},
#                   {"name": "গুরুতর (20-24)", "value": 0}
#                 ],
#                 "ageDistribution": [
#                   {"ageGroup": "18-24", "count": 0},
#                   {"ageGroup": "25-34", "count": 0},
#                   {"ageGroup": "35-44", "count": 0},
#                   {"ageGroup": "45-54", "count": 0},
#                   {"ageGroup": "55+", "count": 0}
#                 ]
#             }), 200

#         severity_counts = {"minimal":0,"mild":0,"moderate":0,"moderately-severe":0,"severe":0}
#         age_groups = {"18-24":0,"25-34":0,"35-44":0,"45-54":0,"55+":0}

#         for r in rows:
#             sev = r.get("severity") or r.get("phq8_severity") or 'minimal'
#             if sev in severity_counts:
#                 severity_counts[sev] += 1

#             try:
#                 age = int(r.get("age", 0))
#             except:
#                 age = 0
#             if 18 <= age <= 24:
#                 age_groups["18-24"] += 1
#             elif 25 <= age <= 34:
#                 age_groups["25-34"] += 1
#             elif 35 <= age <= 44:
#                 age_groups["35-44"] += 1
#             elif 45 <= age <= 54:
#                 age_groups["45-54"] += 1
#             else:
#                 age_groups["55+"] += 1

#         sd = [
#             {"name": "সর্বনিম্ন (0-4)", "value": round((severity_counts["minimal"] / total_tests) * 100, 1)},
#             {"name": "সামান্য (5-9)", "value": round((severity_counts["mild"] / total_tests) * 100, 1)},
#             {"name": "মাঝারি (10-14)", "value": round((severity_counts["moderate"] / total_tests) * 100, 1)},
#             {"name": "মাঝারি থেকে গুরুতর (15-19)", "value": round((severity_counts["moderately-severe"] / total_tests) * 100, 1)},
#             {"name": "গুরুতর (20-24)", "value": round((severity_counts["severe"] / total_tests) * 100, 1)}
#         ]

#         ad = [{"ageGroup": k, "count": v} for k,v in age_groups.items()]

#         return jsonify({"totalTests": total_tests, "statusDistribution": sd, "ageDistribution": ad}), 200

#     except Exception as e:
#         return jsonify({"error":"failed","details": str(e)}), 500

@app.route('/api/stats')
def get_stats():
    try:
        response = supabase.table('voice_assessments').select('*').execute()
        data = response.data or []

        total_tests = len(data)
        total_audio = sum(1 for d in data if d.get('audioData') or d.get('audio_path'))
        avg_phq8 = (
            sum(d.get('phq8_total_score', 0) for d in data) / total_tests
            if total_tests > 0 else 0
        )

        # --- Gender Ratio ---
        male = sum(1 for d in data if (d.get('gender') or '').lower() == 'male')
        female = sum(1 for d in data if (d.get('gender') or '').lower() == 'female')
        male_percent = round((male / total_tests) * 100, 1) if total_tests > 0 else 0
        female_percent = round((female / total_tests) * 100, 1) if total_tests > 0 else 0

        # --- Severity Distribution ---
        severity_counts = {"minimal": 0, "mild": 0, "moderate": 0, "moderately-severe": 0, "severe": 0}
        for d in data:
            sev = (d.get("severity") or "").lower()
            if sev in severity_counts:
                severity_counts[sev] += 1

        status_distribution = [
            {"name": "সর্বনিম্ন (0-4)", "value": round((severity_counts["minimal"] / total_tests) * 100, 1) if total_tests > 0 else 0},
            {"name": "সামান্য (5-9)", "value": round((severity_counts["mild"] / total_tests) * 100, 1) if total_tests > 0 else 0},
            {"name": "মাঝারি (10-14)", "value": round((severity_counts["moderate"] / total_tests) * 100, 1) if total_tests > 0 else 0},
            {"name": "মাঝারি থেকে গুরুতর (15-19)", "value": round((severity_counts["moderately-severe"] / total_tests) * 100, 1) if total_tests > 0 else 0},
            {"name": "গুরুতর (20-24)", "value": round((severity_counts["severe"] / total_tests) * 100, 1) if total_tests > 0 else 0},
        ]

        # --- Age Distribution ---
        age_groups = {"18-24": 0, "25-34": 0, "35-44": 0, "45-54": 0, "55+": 0}
        for d in data:
            try:
                age = int(d.get("age", 0))
            except:
                continue
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

        age_distribution = [{"ageGroup": k, "count": v} for k, v in age_groups.items()]

        return jsonify({
            "totalTests": total_tests,
            "totalAudio": total_audio,
            "averagePhq8": round(avg_phq8, 2),
            "malePercent": male_percent,
            "femalePercent": female_percent,
            "statusDistribution": status_distribution,
            "ageDistribution": age_distribution
        })
    except Exception as e:
        print("Error fetching stats:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/submit_test", methods=["POST"])
def submit_test():
    """
    Accepts JSON payload from frontend. Required fields:
    - age, gender, currentMedication, recordingEnvironment, languageDialect
    - question1..question8 (0..3)
    - consent or consentData (object with required consent booleans)
    - audioData (base64 string, may include data: prefix)
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error":"invalid_json"}), 400

        # Accept consent key in either name
        consent = data.get("consent") or data.get("consentData") or {}

        # Validate required fields
        required = ["age","gender","currentMedication","recordingEnvironment","languageDialect",
                    "question1","question2","question3","question4","question5","question6","question7","question8","audioData"]
        for field in required:
            if field not in data:
                return jsonify({"error": f"missing_{field}"}), 400

        # age validation
        try:
            age = int(data.get("age"))
        except:
            return jsonify({"error":"age_must_be_integer"}), 400
        if age < 18:
            return jsonify({"error":"age_must_be_18_or_over"}), 400

        # optional: enforce consent fields are true
        consent_required_fields = [
            "voluntary","optOut","ageConfirm","aiRole","purpose",
            "nonDiagnostic","dataType","anonymization","futureResearch","thirdParty"
        ]
        for cf in consent_required_fields:
            if not consent.get(cf, False):
                return jsonify({"error": f"consent_required_{cf}"}), 400

        # compute PHQ8 score & severity
        phq_answers = {f"question{i}": data.get(f"question{i}") for i in range(1,9)}
        score, severity = calculate_phq8_score_and_severity(phq_answers)

        # create assessment id
        aid = str(uuid.uuid4())

        # upload audio to storage (returns storage_path and signed url)
        audio_base64 = data.get("audioData")
        storage_path, signed_url = None, None
        if audio_base64:
            try:
                storage_path, signed_url = upload_audio_base64(aid, audio_base64)
            except Exception as e:
                # upload failed; continue but don't block insertion
                print("audio upload error:", e)
                storage_path, signed_url = None, None

        record = {
            "id": aid,
            "full_name": data.get("fullName") or None,
            "age": age,
            "gender": data.get("gender"),
            "current_medication": data.get("currentMedication"),
            "recording_environment": data.get("recordingEnvironment"),
            "language_dialect": data.get("languageDialect"),
            "question1": int(data.get("question1")),
            "question2": int(data.get("question2")),
            "question3": int(data.get("question3")),
            "question4": int(data.get("question4")),
            "question5": int(data.get("question5")),
            "question6": int(data.get("question6")),
            "question7": int(data.get("question7")),
            "question8": int(data.get("question8")),
            "phq8_total_score": score,
            "severity": severity,
            "consent_data": consent,
            "audio_path": storage_path,
            "audio_url": signed_url,
            "has_audio": bool(signed_url),
            "status": "submitted",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }

        # insert to supabase
        insert_res = supabase.table(ASSESSMENTS_TABLE).insert(record).execute()
        # check result
        data_inserted = _safe_get_response_data(insert_res)

        return jsonify({
            "testId": aid,
            "status": "submitted",
            "phq8Score": score,
            "severity": severity
        }), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error":"server_error","details": str(e)}), 500


@app.route("/api/assessment/<aid>")
def get_assessment(aid):
    try:
        res = supabase.table(ASSESSMENTS_TABLE).select("*").eq("id", aid).execute()
        rows = _safe_get_response_data(res) or []
        if not rows:
            return jsonify({"error": "not_found"}), 404
        return jsonify(rows[0]), 200
    except Exception as e:
        return jsonify({"error":"server_error","details": str(e)}), 500


@app.route("/api/assessments")
def all_assessments():
    try:
        limit = int(request.args.get("limit", 50))
        offset = int(request.args.get("offset", 0))
        res = supabase.table(ASSESSMENTS_TABLE).select("*").order("created_at", desc=True).range(offset, offset + limit - 1).execute()
        rows = _safe_get_response_data(res) or []
        return jsonify({"assessments": rows, "count": len(rows)}), 200
    except Exception as e:
        return jsonify({"error":"server_error","details": str(e)}), 500


if __name__ == "__main__":
    print("Starting backend on port", PORT)
    app.run(debug=True, host="127.0.0.1", port=PORT)

