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
    style: str = "casual"
    slang: str = "medium"
    emojis: str = "low"


@app.post("/convert")
def convert_text(request: TextRequest):

    prompt = f"""
Rewrite the following text in modern Gen Z internet language.

Rules:
- Preserve the original meaning.
- Don't invent information.
- Keep names, numbers and URLs unchanged.
- Make the language sound natural, not forced.
- Use slang appropriate to the requested intensity.
- Return ONLY the rewritten text.

Style: {request.style}
Slang intensity: {request.slang}
Emoji intensity: {request.emojis}

Text:
{request.text}
"""

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt
    )

    return {
        "result": response.output_text
    }