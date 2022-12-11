from typing import Optional
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, BaseSettings
import openai
import re
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import boto3
import uuid
import firebase_admin
from firebase_admin import db
import json

from .image_functions import image_pipeline

load_dotenv()


class Settings(BaseSettings):
    OPENAI_API_KEY: str = 'OPENAI_API_KEY'
    AWS_KEY: str = 'AWS_KEY'
    AWS_SECRET_KEY: str = 'AWS_SECRET_KEY'
    DB_URL: str = 'DB_URL'
    FIREBASE_PATH: str = 'FIREBASE_PATH'

    class Config:
        env_file = '.env'


settings = Settings()
openai.api_key = settings.OPENAI_API_KEY

cred_obj = firebase_admin.credentials.Certificate(settings.FIREBASE_PATH)
databaseURL = settings.DB_URL
default_app = firebase_admin.initialize_app(cred_obj, {
    'databaseURL':databaseURL
})

class GeneratePoemInput(BaseModel):
    receiver: str
    likes: str
    interests: str
    verseCount: int
    person: Optional[str]
    fact: Optional[str]

app = FastAPI(debug=True)

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


#@app.post("/", response_class=HTMLResponse)
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

def normalise_poem(poem: str) -> str:
    # Find and remove all occurences of "Verse 1", "Verse 2", "Paragraph 1: etc
    normalised_poem = re.sub(r"(Verse|Paragraph) \d+\:?", "", poem)
    # collapse multiple newlines into one
    normalised_poem = re.sub(r'\n\s*\n', '\n\n', normalised_poem)

    return normalised_poem.strip()

@app.post("/generate/poem")
def generate_poem(
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
            max_tokens=1000,
            timeout=1000,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        result = normalise_poem(response.choices[0].text)
        results.append({"style": style, "poem": result})
    return {"results": results}

@app.post("/generate/image")
def generate_image(
    file: UploadFile = File(...),
):
    file_location = f"{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    urls = image_pipeline(file_location)

    return {"results": urls}

def upload_img(img):
    # pass in is_async=True to create an async client
    s3 = boto3.resource(
    service_name='s3',
    region_name='eu-central-1',
    aws_access_key_id=settings.AWS_KEY,
    aws_secret_access_key=settings.AWS_SECRET_KEY
)
    s3.Bucket('raindeers-bucket').upload_file(Filename=img, Key='testing_shit.jpg')
    return img



@app.get("/card")  
async def card(id):
    try:
        ref = db.reference('cards')
        card = ref.order_by_child('id').equal_to(id).get()
        items = list(card.items())
        return items[0][1]
    except Exception as e:
        return {}


@app.post("/publish")
async def publish(poem, sender, image):
    id = str(uuid.uuid4())
    ref = db.reference("/cards")
    values = {"id": id, "poem": poem, "sender": sender, "image": image}
    ref.push().set(values)
    return id



