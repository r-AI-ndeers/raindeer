from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Poem(BaseModel):
    recipientName: str
    senderName: str
    context: str

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/generate/poem")
def generate_poem( poem: Poem):
    return {"recipient": poem.recipientName, "sender": poem.senderName, "context": poem.context}