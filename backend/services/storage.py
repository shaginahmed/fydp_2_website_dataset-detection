import os
import tempfile
import base64
from services.supabase_client import supabase
from typing import Tuple

BUCKET = os.getenv("SUPABASE_BUCKET", "voice_recordings")

def upload_audio_base64(assessment_id: str, audio_base64: str, content_type: str = "audio/webm") -> Tuple[str, str]:
    """
    Upload a base64 audio string to Supabase Storage.
    Returns (storage_path, signed_url)
    """
    if not audio_base64:
        return None, None

    # Remove MIME prefix if present
    if audio_base64.startswith("data:"):
        audio_base64 = audio_base64.split(",", 1)[1]

    try:
        audio_bytes = base64.b64decode(audio_base64)
    except Exception:
        raise ValueError("Invalid Base64 audio string")

    filename = f"{assessment_id}.webm"
    storage_path = f"recordings/{filename}"

    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        tmp.write(audio_bytes)
        tmp.flush()
        tmp_path = tmp.name

    # Upload file to Supabase Storage
    supabase.storage.from_(BUCKET).upload(
        storage_path,
        tmp_path,
        {"content-type": content_type, "upsert": True}
    )

    # Cleanup temp file
    try:
        os.unlink(tmp_path)
    except:
        pass

    # Create signed URL (24 hours)
    signed = supabase.storage.from_(BUCKET).create_signed_url(
        storage_path,
        24 * 3600
    )

    signed_url = None
    if isinstance(signed, dict):
        signed_url = signed.get("signedURL") or signed.get("signed_url")

    return storage_path, signed_url
