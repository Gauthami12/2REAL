from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str
    mode: str = "casual"
    level: int = 2


@app.post("/convert")
def convert_text(request: TextRequest):

    level_names = {
        1: "MID GEN Z",
        2: "CHRONICALLY ONLINE",
        3: "FULL BRAIN-ROT"
    }

    level = level_names.get(
        request.level,
        "CHRONICALLY ONLINE"
    )
    prompt = f"""
You are GenZify, an AI that converts normal text into
natural modern Gen Z internet language.

MODE:
{request.mode}

INTENSITY:
{request.level}

RULES:

- Preserve the original meaning.
- Do not invent facts.
- Do not change names, numbers, URLs, dates, or important information.
- Make the result sound natural.
- Do not force slang into every sentence.
- Use current internet slang appropriately.
- The higher the intensity, the more exaggerated the language can become.
- Return ONLY the converted text.
- Do not explain what you changed.

MODE DEFINITIONS:

CASUAL:
Make the text sound naturally Gen Z and conversational.

FUNNY:
Make the text more humorous and playful while preserving the meaning.

SAVAGE:
Make the text more blunt, confident, and slightly ruthless while
still preserving the original meaning.

INTENSITY DEFINITIONS:

MID GEN Z:
Light slang. Keep it relatively understandable.

CHRONICALLY ONLINE:
More slang, internet expressions, and occasional emojis.

FULL BRAIN-ROT:
Highly chaotic internet language, exaggerated slang, and
appropriate emojis. Still preserve the original meaning.

TEXT TO CONVERT:
{request.text}
"""

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt
    )

    return {
        "result": response.output_text
    }