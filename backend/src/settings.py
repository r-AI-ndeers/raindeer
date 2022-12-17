import json

import firebase_admin
from dotenv import load_dotenv
from pydantic import BaseSettings

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
    ALLOWED_ORIGIN: str = 'ALLOWED_ORIGIN'
    MODEL: str = 'MODEL'
    HUGGINGFACE_TOKEN = 'HUGGINGFACE_TOKEN'

    #class Config:
    #    env_file = '.env'

GLOBAL_SETTINGS = Settings()

firebase_config = GLOBAL_SETTINGS.FIREBASE_PATH
if GLOBAL_SETTINGS.FIREBASE_JSON:
    firebase_config = json.loads(GLOBAL_SETTINGS.FIREBASE_JSON)

cred_obj = firebase_admin.credentials.Certificate(firebase_config)
FIREBASE_CLIENT = firebase_admin.initialize_app(cred_obj, {
    'databaseURL': GLOBAL_SETTINGS.DB_URL
})
