import uuid
from typing import Optional

from firebase_admin import db
from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter()


class PublishInput(BaseModel):
    poem: str
    sender: str
    image: Optional[str]


@router.post("/publish")
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
