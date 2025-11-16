#!/usr/bin/env python3
"""
Quick upload test - bypasses bucket listing
Place in: backend/quick_upload_test.py
Run: python quick_upload_test.py
"""

import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
load_dotenv()

from services.storage import upload_audio_base64

print("=" * 60)
print("QUICK UPLOAD TEST")
print("=" * 60)

# Small test audio (valid base64 - properly padded)
test_audio = "data:audio/webm;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

print("\n📤 Uploading test audio...")
print(f"   Audio size: {len(test_audio)} chars")

try:
    path, url = upload_audio_base64("quick-test-123", test_audio)
    
    print("\n✅ SUCCESS!")
    print(f"   Storage path: {path}")
    print(f"   Signed URL: {url[:80]}..." if url and len(url) > 80 else f"   Signed URL: {url}")
    
    print("\n✅ Your audio upload is WORKING!")
    print("\n📋 Next steps:")
    print("   1. Check Supabase Storage dashboard")
    print("   2. You should see: recordings/quick-test-123.webm")
    print("   3. The system is ready to use!")
    
except Exception as e:
    print(f"\n❌ FAILED: {e}")
    print(f"\n📋 Check:")
    print(f"   • Bucket 'voice_recordings' exists")
    print(f"   • Bucket is public OR has proper policies")
    print(f"   • Using service_role key (not anon key)")

print("\n" + "=" * 60)














AAAAAAAAAAAAAAAAAAAAAAAAAAAA