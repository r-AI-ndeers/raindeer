from firebase_admin import db
from fastapi import APIRouter

router = APIRouter()

@router.get("/cards/{id}")
async def card(id: str):
    try:
        ref = db.reference('cards')
        card = ref.order_by_child('id').equal_to(id).get()
        items = list(card.items())
        return items[0][1]
    except Exception as e:
        return {}
