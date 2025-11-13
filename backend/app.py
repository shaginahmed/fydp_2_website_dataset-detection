# app.py
import os
import io
import base64
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import storage, firestore
from pydub import AudioSegment

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def init_firebase():
    """
    Initialize Firestore and Storage.
    Expects FIREBASE_CREDENTIALS env var containing full JSON string of service account key,
    and FIREBASE_BUCKET env var with bucket name.
    """
    creds = os.environ.get("FIREBASE_CREDENTIALS")
    if creds:
        key_path = "/tmp/firebase_key.json"
        with open(key_path, "w") as f:
            f.write(creds)
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = key_path

    db = firestore.Client()
    storage_client = storage.Client()
    bucket_name = os.environ.get("FIREBASE_BUCKET")
    bucket = storage_client.bucket(bucket_name) if bucket_name else None
    return db, bucket

db, bucket = init_firebase()
bucket = None  # disable storage for free plan

def save_audio_and_convert(raw_bytes: bytes, out_wav_path: str):
    tmp_webm = out_wav_path + ".webm"
    with open(tmp_webm, "wb") as f:
        f.write(raw_bytes)
    audio = AudioSegment.from_file(tmp_webm, format="webm")
    audio.export(out_wav_path, format="wav")
    return out_wav_path

@app.route("/api/submit_test", methods=["POST"])
def submit_test():
    """
    Accept JSON payload from frontend:
    {
      "fullName": "...",
      "age": 25,
      "question1": 0,
      "question2": 1,
      "question3": 3,
      "audioData": "<base64 or dataURL string>"
    }
    """
    try:
        payload = request.get_json(force=True)
        full_name = payload.get("fullName", "")
        age = payload.get("age")
        q1 = payload.get("question1")
        q2 = payload.get("question2")
        q3 = payload.get("question3")
        audio_b64 = payload.get("audioData")

        if not audio_b64:
            return jsonify({"error": "audioData required"}), 400

        # handle dataURL or pure base64
        if audio_b64.startswith("data:"):
            _, audio_b64 = audio_b64.split(",", 1)

        audio_bytes = base64.b64decode(audio_b64)

        test_id = str(uuid.uuid4())
        tmp_wav_path = f"/tmp/{test_id}.wav"
        save_audio_and_convert(audio_bytes, tmp_wav_path)

        # Skip Firebase Storage (no paid plan)
        # Optionally, you can keep a local copy of the WAV file
        storage_path = f"local_files/{test_id}.wav"
        os.makedirs("local_files", exist_ok=True)
        os.rename(tmp_wav_path, storage_path)

        doc = {
            "testId": test_id,
            "fullName": full_name,
            "age": age,
            "question1": q1,
            "question2": q2,
            "question3": q3,
            "audio_storage_path": storage_path,
            "created_at": firestore.SERVER_TIMESTAMP,
            "status": "pending",
            "model_result": None
        }
        db.collection("assessments").document(test_id).set(doc)

        return jsonify({"testId": test_id, "result": "model is in training"}), 200

    except Exception as e:
        app.logger.exception("Error in submit_test")
        return jsonify({"error": str(e)}), 500

@app.route("/api/stats", methods=["GET"])
def stats():
    try:
        docs = list(db.collection("assessments").limit(1000).stream())
        total = len(docs)
        dist = {}
        for d in docs:
            s = d.to_dict().get("status", "unknown")
            dist[s] = dist.get(s, 0) + 1
        return jsonify({"totalTests": total, "statusDistribution": dist})
    except Exception:
        # fallback demo
        return jsonify({"totalTests": 0, "statusDistribution": {}})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
