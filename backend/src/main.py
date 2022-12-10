from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, BaseSettings
import openai
from dotenv import load_dotenv
from supabase import create_client, Client

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
    #senderName: str
    #context: str


app = FastAPI()


@app.get("/")
def read_root():
    return {"test": "success"}

@app.post("/", response_class=HTMLResponse)


def generate_prompt(style, receiver="", likes="", interests="", verseCount=3, person="", fact=""):
    PROMPT_SIMPLE = "Christmas poem to {}, they likes {} and is interested in {}, {} verses".format(receiver, likes, interests, verseCount)
    if style == "simple":
        return PROMPT_SIMPLE
    elif style == "personal":
        return  "Write a {} paragraph Christmas poem to {} who is {} and who loves {}. {} is {}.".format(verseCount, receiver, person, likes, receiver, fact)
    elif style == "ghetto":
        return PROMPT_SIMPLE + ", ghetto style Christmas poem."
    elif style == "shakespeare":
        return PROMPT_SIMPLE, ", Shakespeare style Christmas poem."
    return PROMPT_SIMPLE

@app.get("/generate/poem")
async def generate_poem(receiver, likes, interests, verseCount, person, fact):
    promptStyles = ["personal", "ghetto", "shakespeare"]
    results = []
    for style in promptStyles:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=generate_prompt(style, receiver, likes, interests, verseCount, person, fact),
            temperature=0.7,
            max_tokens=10,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        result = response.choices[0].text
        results.append({"style": style, "poem": result})
    return {"results": results}


@app.get("/image")
def image():
    #theme['monsterThemeBg'] = supabase.storage().StorageFileAPI(BUCKET_NAME).get_public_url(FILE_LOCATION)
    image = supabase.storage().StorageFileAPI('images').get_public_url('uploaded/test.png')
    return image