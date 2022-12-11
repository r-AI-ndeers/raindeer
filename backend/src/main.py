from typing import Optional

from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel, BaseSettings
import openai
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import uuid
import firebase_admin
from firebase_admin import db

from .image_functions import image_pipeline
from .poem_functions import generate_prompt, normalise_poem

load_dotenv()

class Settings(BaseSettings):
    OPENAI_API_KEY: str = 'OPENAI_API_KEY'
    AWS_KEY: str = 'AWS_KEY'
    AWS_SECRET_KEY: str = 'AWS_SECRET_KEY'
    DB_URL: str = 'DB_URL'
    FIREBASE_PATH: str = 'FIREBASE_PATH'
    FIREBASE_JSON: str = 'FIREBASE_JSON'

    #class Config:
    #    env_file = '.env'


settings = Settings()
openai.api_key = settings.OPENAI_API_KEY

firebase_config = settings.FIREBASE_PATH
if settings.FIREBASE_JSON:
    firebase_config = json.loads(settings.FIREBASE_JSON)
cred_obj = firebase_admin.credentials.Certificate(firebase_config)
databaseURL = settings.DB_URL
default_app = firebase_admin.initialize_app(cred_obj, {
    'databaseURL': databaseURL
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


@app.get("/test")
def read_root():
    return {"test": "success"}


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


@app.get("/cards/{id}")
async def card(id):
    try:
        ref = db.reference('cards')
        card = ref.order_by_child('id').equal_to(id).get()
        items = list(card.items())
        return items[0][1]
    except Exception as e:
        return {}


class PublishInput(BaseModel):
    poem: str
    sender: str
    image: Optional[str]


@app.post("/publish")
async def publish(publish_input: PublishInput):
    try:
        id = str(uuid.uuid4())
        ref = db.reference("/cards")
        values = {"id": id, "poem": publish_input.poem, "sender": publish_input.sender,
                "image": publish_input.image}
        ref.push().set(values)
        return {"id": id}
    except Exception as e:
        return {"id": ""}
