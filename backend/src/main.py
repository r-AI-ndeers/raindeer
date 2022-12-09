from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Card(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/card/{card_id}")
def read_card(card_id: int, q: Union[str, None] = None):
    return {"card_id": card_id, "q": q}


@app.put("/card/{card_id}")
def update_card(card_id: int, card: Card):
    return {"card_name": card.name, "card_id": card_id}