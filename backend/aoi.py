from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from openai import OpenAI

from dotenv import load_dotenv

import os


# ========================================
# LOAD ENVIRONMENT VARIABLES
# ========================================

load_dotenv()


# ========================================
# APP
# ========================================

app = FastAPI()


# ========================================
# OPENAI
# ========================================

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


# ========================================
# CORS
# ========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=False,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ========================================
# REQUEST
# ========================================

class TextRequest(BaseModel):

    text: str

    mode: str = "casual"

    level: int = 2


# ========================================
# CONVERT
# ========================================

@app.post("/convert")
def convert_text(request: TextRequest):


    levels = {

        1: "MID GEN Z",

        2: "CHRONICALLY ONLINE",

        3: "FULL BRAIN-ROT"

    }


    level_name = levels.get(
        request.level,
        "CHRONICALLY ONLINE"
    )


    prompt = f"""
You are GenZify.

Your job is to convert normal text
into natural modern Gen Z language.

MODE:
{request.mode.upper()}

GEN Z LEVEL:
{level_name}


CASUAL:
Make the text naturally Gen Z.
Keep it understandable.
Use light slang.

FUNNY:
Make it playful and funny.
Use internet humor where appropriate.

SAVAGE:
Make it bold, blunt and chaotic.
Do not change the meaning.


MID GEN Z:
Use light slang.

CHRONICALLY ONLINE:
Use more internet slang,
humor and expressive language.

FULL BRAIN-ROT:
Use very online,
chaotic Gen Z language,
slang and emojis.


IMPORTANT:

- Preserve the original meaning.
- Do not invent facts.
- Do not add unrelated information.
- Do not change names.
- Do not change numbers.
- Do not change URLs.
- Do not change dates.
- Make it sound natural.
- Do not force slang.
- Return ONLY the converted text.


TEXT:

{request.text}
"""


    response = client.responses.create(

        model="gpt-5.6-luna",

        input=prompt

    )


    return {
        "result": response.output_text
    }
