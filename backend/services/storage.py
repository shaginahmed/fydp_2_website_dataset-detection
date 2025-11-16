import os
import base64
from services.supabase_client import supabase
from typing import Tuple, Optional
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BUCKET = os.getenv("SUPABASE_BUCKET", "voice_recordings")


def upload_audio_base64(
    assessment_id: str, 
    audio_base64: str, 
    content_type: str = "audio/webm"
) -> Tuple[Optional[str], Optional[str]]:
    """
    Upload a base64 audio string to Supabase Storage.
    
    Args:
        assessment_id: Unique ID for the assessment (used as filename)
        audio_base64: Base64 encoded audio data (with or without data: prefix)
        content_type: MIME type of the audio file
    
    Returns:
        Tuple of (storage_path, signed_url)
        - storage_path: Path in storage bucket (e.g., "recordings/uuid.webm")
        - signed_url: Signed URL valid for 24 hours
        
    Raises:
        ValueError: If audio_base64 is invalid
        Exception: If upload fails after retry
    """
    
    if not audio_base64:
        logger.warning("No audio data provided")
        return None, None

    # Remove MIME prefix if present (e.g., "data:audio/webm;base64,")
    if audio_base64.startswith("data:"):
        audio_base64 = audio_base64.split(",", 1)[1]

    # Decode base64 to bytes
    try:
        audio_bytes = base64.b64decode(audio_base64)
        logger.info(f"✓ Decoded audio: {len(audio_bytes)} bytes")
    except Exception as e:
        logger.error(f"❌ Base64 decode error: {e}")
        raise ValueError(f"Invalid Base64 audio string: {e}")

    # Determine file extension from content type
    extension = "webm"
    if "mp3" in content_type.lower():
        extension = "mp3"
    elif "wav" in content_type.lower():
        extension = "wav"
    elif "ogg" in content_type.lower():
        extension = "ogg"
    
    filename = f"{assessment_id}.{extension}"
    storage_path = f"recordings/{filename}"

    # Upload to Supabase Storage
    try:
        logger.info(f"Uploading to: {storage_path}")
        
        upload_res = supabase.storage.from_(BUCKET).upload(
            path=storage_path,
            file=audio_bytes,
            file_options={"content-type": content_type}
        )
        
        logger.info(f"✓ Upload successful: {upload_res}")

    except Exception as e:
        error_msg = str(e)
        logger.error(f"❌ Upload error: {error_msg}")
        
        # Handle "file already exists" error
        if "already exists" in error_msg.lower() or "duplicate" in error_msg.lower():
            logger.warning("File exists, attempting to replace...")
            try:
                # Delete old file
                supabase.storage.from_(BUCKET).remove([storage_path])
                logger.info("✓ Old file deleted")
                
                # Re-upload
                upload_res = supabase.storage.from_(BUCKET).upload(
                    path=storage_path,
                    file=audio_bytes,
                    file_options={"content-type": content_type}
                )
                logger.info(f"✓ File replaced successfully")
                
            except Exception as update_error:
                logger.error(f"❌ Replace failed: {update_error}")
                raise Exception(f"Failed to replace audio file: {update_error}")
        else:
            # Other upload errors
            raise Exception(f"Failed to upload audio: {e}")

    # Generate signed URL (valid for 24 hours)
    signed_url = None
    try:
        signed_res = supabase.storage.from_(BUCKET).create_signed_url(
            storage_path,
            expires_in=86400  # 24 hours in seconds
        )
        
        logger.info(f"✓ Signed URL response: {type(signed_res)}")
        
        # Extract signed URL from response (different Supabase SDK versions use different keys)
        if isinstance(signed_res, dict):
            signed_url = (
                signed_res.get("signedURL") or 
                signed_res.get("signed_url") or 
                signed_res.get("signedUrl") or
                signed_res.get("url")
            )
        
        if signed_url:
            logger.info(f"✓ Signed URL generated successfully")
        else:
            logger.warning(f"⚠️ Could not extract signed URL, trying public URL...")
            # Fallback to public URL if signed URL fails
            try:
                public_url = supabase.storage.from_(BUCKET).get_public_url(storage_path)
                signed_url = public_url
                logger.info(f"✓ Using public URL as fallback")
            except:
                logger.error("❌ Failed to get any URL")

    except Exception as e:
        logger.error(f"❌ Signed URL generation error: {e}")
        # Continue anyway - we have the storage path

    logger.info(f"✓ Upload complete - Path: {storage_path}, URL: {bool(signed_url)}")
    return storage_path, signed_url


def delete_audio(storage_path: str) -> bool:
    """
    Delete an audio file from storage.
    
    Args:
        storage_path: Path in storage (e.g., "recordings/uuid.webm")
    
    Returns:
        True if deletion successful, False otherwise
    """
    try:
        supabase.storage.from_(BUCKET).remove([storage_path])
        logger.info(f"✓ Deleted: {storage_path}")
        return True
    except Exception as e:
        logger.error(f"❌ Delete failed: {e}")
        return False


def get_file_url(storage_path: str, expires_in: int = 86400) -> Optional[str]:
    """
    Get a signed URL for a file in storage.
    
    Args:
        storage_path: Path in storage
        expires_in: URL validity in seconds (default: 24 hours)
    
    Returns:
        Signed URL or None if failed
    """
    try:
        signed_res = supabase.storage.from_(BUCKET).create_signed_url(
            storage_path,
            expires_in=expires_in
        )
        
        if isinstance(signed_res, dict):
            return (
                signed_res.get("signedURL") or 
                signed_res.get("signed_url") or 
                signed_res.get("signedUrl") or
                signed_res.get("url")
            )
        return None
        
    except Exception as e:
        logger.error(f"❌ Failed to get signed URL: {e}")
        return None