from dotenv import load_dotenv
from google import genai
import os
import asyncio

# Load environment variables
load_dotenv()

# Read API key EXACTLY like Google sample
gemini_api_key = os.getenv("GEMINI_API_KEY")

if not gemini_api_key:
    raise RuntimeError("GEMINI_API_KEY is missing")

# ✅ Google-style client (NO genai.configure, NO GenerativeModel)
client = genai.Client(api_key=gemini_api_key)

# ✅ Model from Google sample
MODEL_NAME = "gemini-3-flash-preview"


async def ask_gemini(prompt: str) -> str:
    """
    Async wrapper around Google Gemini client
    """
    try:
        # Run blocking SDK call in thread
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=MODEL_NAME,
            contents=prompt,
        )

        if not response or not response.text:
            return "No response from Gemini"

        return response.text

    except Exception as e:
        # This will show up clearly in FastAPI logs
        raise RuntimeError(f"Gemini API error: {e}")
