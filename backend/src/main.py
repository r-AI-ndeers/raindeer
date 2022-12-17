from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from src.settings import GLOBAL_SETTINGS


def register_routes(app):
    from src.routes import poem, image, card, publish

    app.include_router(poem.router)
    app.include_router(image.router)
    app.include_router(card.router)
    app.include_router(publish.router)


app = FastAPI(debug=True)
register_routes(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[GLOBAL_SETTINGS.ALLOWED_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

