import os
import io
import base64
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from pydub import AudioSegment

app = Flask(__name__)
CORS(app)

# Try to import Firebase libraries
try:
    from google.cloud import storage, firestore
except Exception:
    storage = firestore = None


def init_firebase():
    """Initialize Firestore and Storage if FIREBASE_CREDENTIALS exist."""
    creds = os.environ.get("FIREBASE_CREDENTIALS")
    bucket_name = os.environ.get("FIREBASE_BUCKET")

    # If credentials not found or libraries missing, skip Firebase
    if not creds or not firestore:
        print("⚠️ Firebase not configured or missing credentials. Using local storage only.")
        return None, None

    try:
        key_path = "/tmp/firebase_key.json"
        with open(key_path, "w") as f:
            f.write(creds)
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = key_path

        db = firestore.Client()
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name) if bucket_name else None
        print("✅ Firebase initialized successfully.")
        return db, bucket
    except Exception as e:
        print("⚠️ Firebase init failed:", e)
        return None, None


db, bucket = init_firebase()


def save_audio_and_convert(raw_bytes: bytes, out_wav_path: str):
    """Convert received webm bytes to wav and save locally."""
    tmp_webm = out_wav_path + ".webm"
    with open(tmp_webm, "wb") as f:
        f.write(raw_bytes)

    # Convert to WAV using pydub + ffmpeg
    audio = AudioSegment.from_file(tmp_webm, format="webm")
    audio.export(out_wav_path, format="wav")
    return out_wav_path


@app.route("/api/submit_test", methods=["POST"])
def submit_test():
    """Receive form data + voice, save locally or in Firestore, reply with prediction."""
    try:
        data = request.get_json(force=True)
        full_name = data.get("fullName")
        age = data.get("age")
        q1 = data.get("question1")
        q2 = data.get("question2")
        q3 = data.get("question3")
        audio_b64 = data.get("audioData")

        if not audio_b64:
            return jsonify({"error": "audioData is required"}), 400

        # Handle base64 or data URL
        if audio_b64.startswith("data:"):
            audio_b64 = audio_b64.split(",", 1)[1]

        audio_bytes = base64.b64decode(audio_b64)
        test_id = str(uuid.uuid4())

        # Save WAV locally
        os.makedirs("local_files", exist_ok=True)
        tmp_wav_path = f"local_files/{test_id}.wav"
        save_audio_and_convert(audio_bytes, tmp_wav_path)

        doc = {
            "testId": test_id,
            "fullName": full_name,
            "age": age,
            "question1": q1,
            "question2": q2,
            "question3": q3,
            "audio_path": tmp_wav_path,
            "created_at": None,
            "status": "pending",
            "model_result": "model is in training"
        }

        # Save to Firestore if available
        if db:
            db.collection("assessments").document(test_id).set(doc)
            print(f"✅ Data saved to Firestore: {test_id}")
        else:
            print(f"💾 Data saved locally: {tmp_wav_path}")

        return jsonify({"testId": test_id, "result": "model is in training"}), 200

    except Exception as e:
        app.logger.exception("Error in submit_test")
        return jsonify({"error": str(e)}), 500


@app.route("/api/stats", methods=["GET"])
def stats():
    """Return number of tests recorded."""
    try:
        if not db:
            # No Firebase, check local folder
            local_files = os.listdir("local_files") if os.path.exists("local_files") else []
            return jsonify({"totalTests": len(local_files), "source": "local"})
        else:
            docs = list(db.collection("assessments").stream())
            return jsonify({"totalTests": len(docs), "source": "firestore"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def root():
    return jsonify({"message": "Backend is running ✅"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
