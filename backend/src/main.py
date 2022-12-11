from typing import Optional

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, BaseSettings
import openai
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import boto3
import uuid

load_dotenv()


class Settings(BaseSettings):
    OPENAI_API_KEY: str = 'OPENAI_API_KEY'
    SUPABASE_URL: str = 'SUPABASE_URL'
    SUPABASE_KEY: str = 'SUPABASE_KEY'
    RDS_USERNAME: str = 'RDS_USERNAME'
    RDS_PASSWORD: str = 'RDS_PASSWORD'
    RDS_PORT: str = 'RDS_PORT'
    RDS_ENDPOINT: str = 'RDS_ENDPOINT'
    RDS_DB_NAME: str = 'RDS_DB_NAME'

    class Config:
        env_file = '.env'


settings = Settings()
openai.api_key = settings.OPENAI_API_KEY
supabaseUrl = settings.SUPABASE_URL
supabaseKey = settings.SUPABASE_KEY
rds_username  = settings.RDS_USERNAME
rds_password = settings.RDS_PASSWORD
rds_port = settings.RDS_PORT
rds_endpoint = settings.RDS_ENDPOINT
rds_db_name = settings.RDS_DB_NAME

supabase: Client = create_client(supabaseUrl, supabaseKey)


class Poem(BaseModel):
    recipientName: str
    # senderName: str
    # context: str


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
        result = response.choices[0].text
        results.append({"style": style, "poem": result})
    return {"results": results}

@app.get("/image")
async def image():
    #theme['monsterThemeBg'] = supabase.storage().StorageFileAPI(BUCKET_NAME).get_public_url(FILE_LOCATION)
    #image = supabase.storage().StorageFileAPI('images').get_public_url('uploaded/test.png')
    image = upload_img()
    return image

def upload_img():
    #file = "backend/src/test1.jpg"
    #image = supabase.storage().StorageFileAPI('images').upload("uploaded/test2.png", file)
    url = supabaseUrl
    key = supabaseKey
    headers = {"apiKey": key, "Authorization": f"Bearer {key}"}

    # pass in is_async=True to create an async client
    path = "/Users/rico.pircklen/personal_coding/hackathon/raindeer/backend/src/test1.jpg"
   
    key='AKIAXYN7CLDZEH77XL34'
    secret_key='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'
    s3 = boto3.resource(
    service_name='s3',
    region_name='eu-central-1',
    aws_access_key_id=key,
    aws_secret_access_key=secret_key
)
    s3.Bucket('raindeers-bucket').upload_file(Filename=path, Key='testing_shit.jpg')
    print(image)
    return image

@app.post("/post_card")  
async def post_card(poem, images):
    print("STARTING")
    id = str(uuid.uuid4())
    # enter to the RDS
    engine = psycopg2.connect(
        database=rds_db_name,
        user=rds_username,
        password=rds_password,
        host=rds_endpoint,
        port=rds_port
    )
    print("XXX")
    cursor = engine.cursor()

    #query = "INSERT INTO {}(id, poem, images, xxx) VALUES(%s,%s,%s)", (rds_db_name, 'This is a poem', "this is image", "sss")
    #cursor.execute(query)
    cursor.execute("""SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public'""")
    for table in cursor.fetchall():
        print(table)
    #self.conn.commit()
    #self.close()
    print('opened database successfully')
    return id