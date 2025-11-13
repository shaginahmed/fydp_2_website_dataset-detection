from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
import datetime
from config import PORT
from services.supabase_service import upload_audio_base64, create_signed_url, insert_record
from services.utils import calculate_phq8_score_from_answers

app = Flask(__name__)
CORS(app)  # in prod, restrict origins

@app.route("/api/submit_test", methods=["POST"])
def submit_test():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "invalid json"}), 400

        # required checks
        phq_answers = data.get("phq8", {})
        if not phq_answers:
            return jsonify({"error": "phq8 answers required"}), 400

        # compute score
        score, category = calculate_phq8_score_from_answers(phq_answers)

        # audio upload if present
        audio_base64 = data.get("audioData")
        audio_path = None
        audio_signed_url = None
        if audio_base64:
            # audioBase64 might include data:<mime>;base64,strip prefix if present
            if audio_base64.startswith("data:"):
                audio_base64 = audio_base64.split(",", 1)[1]
            filename = f"{uuid.uuid4().hex}.webm"
            audio_path = upload_audio_base64(audio_base64, filename)
            # create short lived signed url (e.g., 24h = 86400s) if you want to return it
            audio_signed_url = create_signed_url(audio_path, expires_in=86400)

        # build DB record
        test_id = uuid.uuid4().hex[:10]
        record = {
            "test_id": test_id,
            "full_name": data.get("fullName"),
            "age": data.get("age"),
            "gender": data.get("gender"),
            "current_medication": data.get("currentMedication"),
            "recording_environment": data.get("recordingEnvironment"),
            "language_dialect": data.get("languageDialect"),
            "consent_data": data.get("consentData"),
            "phq8_score": score,
            "phq8_category": category,
            "phq8_answers": phq_answers,
            "audio_path": audio_path,
            "audio_url": audio_signed_url
        }

        inserted = insert_record(record)

        return jsonify({"message": "Test submitted", "testId": test_id}), 200

    except Exception as e:
        print("submit_test error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/stats", methods=["GET"])
def get_stats():
    try:
        res = None
        # select all rows
        data = supabase.table("phq8_assessments").select("*").execute()
        rows = data.data if hasattr(data, "data") else data.get("data", [])
        total = len(rows)
        if total == 0:
            return jsonify({"totalTests": 0, "statusDistribution": [], "ageDistribution": []})

        scores = [r.get("phq8_score", 0) for r in rows]
        def count_in(low, high):
            return len([s for s in scores if low <= s <= high])

        status_counts = {
            "0_4": count_in(0,4),
            "5_9": count_in(5,9),
            "10_14": count_in(10,14),
            "15_19": count_in(15,19),
            "20_24": count_in(20,24)
        }

        # example age distribution
        ages = {}
        for r in rows:
            age = r.get("age")
            if not age:
                continue
            if 18 <= age <= 24:
                ages.setdefault("18-24",0); ages["18-24"]+=1
            elif 25 <= age <= 34:
                ages.setdefault("25-34",0); ages["25-34"]+=1
            elif 35 <= age <= 44:
                ages.setdefault("35-44",0); ages["35-44"]+=1
            elif 45 <= age <= 54:
                ages.setdefault("45-54",0); ages["45-54"]+=1
            else:
                ages.setdefault("55+",0); ages["55+"]+=1

        stats = {
            "totalTests": total,
            "statusDistribution": [
                {"name": "সর্বনিম্ন বা অনুপস্থিত", "value": status_counts["0_4"]},
                {"name": "সামান্য", "value": status_counts["5_9"]},
                {"name": "মাঝারি", "value": status_counts["10_14"]},
                {"name": "মাঝারি থেকে গুরুতর", "value": status_counts["15_19"]},
                {"name": "গুরুতর", "value": status_counts["20_24"]}
            ],
            "ageDistribution": [{"ageGroup": k, "count": v} for k,v in ages.items()]
            # you can add 6-month trend later by grouping created_at by month
        }
        return jsonify(stats)
    except Exception as e:
        print("stats error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=PORT)