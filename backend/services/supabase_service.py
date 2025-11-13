from supabase import create_client
from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import base64
import io
import uuid

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

BUCKET_NAME = "audio"  # your bucket name

def upload_audio_base64(base64_str: str, filename: str = None):
    """Upload base64 audio string to Supabase storage, return storage path."""
    if not filename:
        filename = f"{uuid.uuid4().hex}.webm"
    path = f"audio/{filename}"

    # convert base64 to bytes
    audio_bytes = base64.b64decode(base64_str)
    # upload expects a file-like object
    file_obj = io.BytesIO(audio_bytes)

    # upload (overwrite = True)
    res = supabase.storage().from_(BUCKET_NAME).upload(path, file_obj, {"cacheControl":"3600", "contentType":"audio/webm"})
    # res may include error; check
    if res.get("error"):
        raise Exception(res["error"])
    return path

def create_signed_url(path: str, expires_in: int = 3600):
    """Return a signed URL for a private file."""
    res = supabase.storage().from_(BUCKET_NAME).create_signed_url(path, expires_in)
    if res.get("error"):
        raise Exception(res["error"])
    return res.get("signedURL") or res.get("signed_url") or res

def insert_record(record: dict):
    """Insert row into phq8_assessments table."""
    res = supabase.table("phq8_assessments").insert(record).execute()
    if res.get("error"):
        raise Exception(res["error"])
    return res.get("data")