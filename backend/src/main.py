from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, BaseSettings
import openai
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    OPENAI_API_KEY: str = 'OPENAI_API_KEY'

    class Config:
        env_file = '.env'

settings = Settings()
openai.api_key = settings.OPENAI_API_KEY


class Poem(BaseModel):
    recipientName: str
    #senderName: str
    #context: str


app = FastAPI()


@app.get("/")
def read_root():
    return {"test": "success"}

@app.post("/", response_class=HTMLResponse)


def generate_prompt(receiver):
    return """Write a hilarious Christmas poem to {}.""".format(receiver)

@app.get("/generate/poem")
async def generate_poem(receiverName):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=generate_prompt(receiverName),
        temperature=0.7,
        max_tokens=10,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    result = response.choices[0].text
    return {"result": result}
