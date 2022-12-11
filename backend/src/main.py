from typing import Optional
import json
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel, BaseSettings
import openai
import numpy as np
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import uuid
import time
import firebase_admin
from firebase_admin import db
from revChatGPT.revChatGPT import Chatbot
from concurrent.futures import ThreadPoolExecutor, as_completed

from .image_functions import image_pipeline
from .poem_functions import generate_prompt, normalise_poem

import json

load_dotenv()

class Settings(BaseSettings):
    OPENAI_API_KEY: str = 'OPENAI_API_KEY'
    AWS_KEY: str = 'AWS_KEY'
    AWS_SECRET_KEY: str = 'AWS_SECRET_KEY'
    DB_URL: str = 'DB_URL'
    FIREBASE_PATH: str = 'FIREBASE_PATH'
    FIREBASE_JSON: str = 'FIREBASE_JSON'
    CHATGPT_EMAIL: str = 'CHATGPT_EMAIL'
    CHATGPT_PASSWORD: str = 'CHATGPT_PASSWORD'
    MODEL: str = 'MODEL'

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


def get_poem(style, data):
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
    return {"style": style, "poem": result}

@app.post("/generate/poem")
def generate_poem(
        data: GeneratePoemInput,
):
    promptStyles = ["personal", "street", "shakespeare"]
    t1 = time.time()
    results = []
    threads = []

    """if settings.MODEL == "CHATGPT":
        for style in promptStyles:
            email = settings.CHATGPT_EMAIL
            password = settings.CHATGPT_PASSWORD
            config = {
            "email": email,
            "password": password,
            }
            chatbot = Chatbot(config, conversation_id=None)
            response = chatbot.get_chat_response(prompt=generate_prompt(style, data.receiver, data.likes, data.interests,
                                    data.verseCount, data.person, data.fact), output="text")
            text = response.get("message")

            result = normalise_poem(text)
            results.append({"style": style, "poem": result})
        return {"results": results}

    else:"""
    with ThreadPoolExecutor(max_workers=10) as executor:
        for style in promptStyles:
            threads.append(executor.submit(get_poem, style, data))
        try:
            for task in as_completed(threads, timeout=15):
                results.append(task.result())
        
        except Exception as e:
            print(e)
            for task in threads:
                task.cancel()      
    t2 = time.time()
    print(f"Time taken for poem generation: {np.round(t2-t1,2)}")
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

