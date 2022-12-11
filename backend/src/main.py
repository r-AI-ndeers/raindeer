from typing import Optional

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, BaseSettings
import openai
import re
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client

from .image_functions import image_pipeline

load_dotenv()


class Settings(BaseSettings):
    OPENAI_API_KEY: str = 'OPENAI_API_KEY'
    SUPABASE_URL: str = 'SUPABASE_URL'
    SUPABASE_KEY: str = 'SUPABASE_KEY'

    class Config:
        env_file = '.env'


settings = Settings()
openai.api_key = settings.OPENAI_API_KEY
supabaseUrl = settings.SUPABASE_URL
supabaseKey = settings.SUPABASE_KEY

supabase: Client = create_client(supabaseUrl, supabaseKey)


class Poem(BaseModel):
    recipientName: str
    # senderName: str
    # context: str


app = FastAPI()

# FIXME: set the right cors in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"test": "success"}


@app.post("/", response_class=HTMLResponse)
def generate_prompt(style, receiver="", likes="", interests="", verseCount=3, person="",
                    fact=""):
    PROMPT_SIMPLE = "Christmas poem to {}, they likes {} and is interested in {}, {} verses".format(
        receiver, likes, interests, verseCount)
    if style == "simple":
        return PROMPT_SIMPLE
    elif style == "personal":
        return "Write a {} paragraph Christmas poem to {} who is {} and who loves {}. {} is {}.".format(
            verseCount, receiver, person, likes, receiver, fact)
    elif style == "ghetto":
        return PROMPT_SIMPLE + ", ghetto style Christmas poem."
    elif style == "shakespeare":
        return PROMPT_SIMPLE, ", Shakespeare style Christmas poem."
    return PROMPT_SIMPLE


class GeneratePoemInput(BaseModel):
    receiver: str
    likes: str
    interests: str
    verseCount: int
    person: Optional[str]
    fact: Optional[str]


@app.post("/generate/poem")
async def generate_poem(
    data: GeneratePoemInput,
):
    promptStyles = ["personal", "ghetto", "shakespeare"]
    results = []
    for style in promptStyles:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=generate_prompt(style, data.receiver, data.likes, data.interests,
                                   data.verseCount, data.person, data.fact),
            temperature=0.7,
            max_tokens=10,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        result = normalise_poem(response.choices[0].text)
        results.append({"style": style, "poem": result})
    return {"results": results}

@app.post("/generate/image")
async def generate_image(
    file: UploadFile = File(...),
):
    file_location = f"{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    urls = image_pipeline(file_location)

    return {"results": urls}

def normalise_poem(poem: str) -> str:
    # Find and remove all occurences of "Verse 1", "Verse 2", "Paragraph 1: etc
    normalised_poem = re.sub(r"(Verse|Paragraph) \d+\:?", "", poem)
    # collapse multiple newlines into one
    normalised_poem = re.sub(r'\n\s*\n', '\n\n', normalised_poem)

    return normalised_poem.strip()

@app.get("/image")
def image():
    image = supabase.storage().StorageFileAPI('images').get_public_url(
        'uploaded/test.png')
    return image
