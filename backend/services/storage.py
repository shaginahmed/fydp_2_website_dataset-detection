# services/storage.py
import os
import tempfile
import base64
from services.supabase_client import supabase
from typing import Tuple

BUCKET = os.getenv("SUPABASE_BUCKET", "voice_recordings")

def _safe_get_response_data(res):
    if res is None:
        return None
    if hasattr(res, "data"):
        return res.data
    if isinstance(res, dict):
        return res.get("data")
    return None

def upload_audio_base64(assessment_id: str, audio_base64: str, content_type: str = "audio/webm") -> Tuple[str, str]:
    """
    Upload a base64 audio string to Supabase storage.
    Returns (storage_path, signed_url_or_public_url_or_None)
    """
    if not audio_base64:
        return None, None

    # strip mime prefix if present
    if audio_base64.startswith("data:"):
        audio_base64 = audio_base64.split(",", 1)[1]

    try:
        audio_bytes = base64.b64decode(audio_base64)
    except Exception as e:
        raise ValueError("invalid base64 audio") from e

    suffix = ".webm" if "webm" in content_type else ""
    filename = f"{assessment_id}{suffix or '.webm'}"
    storage_path = f"recordings/{filename}"

    # write to temp file (supabase client expects file path or file-like)
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(audio_bytes)
        tmp.flush()
        tmp_path = tmp.name

    # upload (upsert true to overwrite same path)
    upload_res = supabase.storage().from_(BUCKET).upload(storage_path, tmp_path, {"content-type": content_type, "upsert": True})
    # cleanup temp file
    try:
        os.unlink(tmp_path)
    except Exception:
        pass

    # handle upload errors
    if isinstance(upload_res, dict) and upload_res.get("error"):
        raise Exception(upload_res.get("error"))

    # create a signed URL (24 hours)
    signed_res = supabase.storage().from_(BUCKET).create_signed_url(storage_path, 24 * 3600)
    signed_data = None
    if isinstance(signed_res, dict):
        signed_data = signed_res.get("signedURL") or signed_res.get("signed_url") or signed_res.get("signedURL")
    elif hasattr(signed_res, "get"):
        signed_data = signed_res.get("signedURL") or signed_res.get("signed_url")

    return storage_path, signed_data
