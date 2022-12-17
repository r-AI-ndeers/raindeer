from src.generation.poem import GeneratePoemInput, generate_poem
from fastapi import APIRouter

router = APIRouter()


@router.post("/generate/poem")
async def generate_poem_endpoint(
        data: GeneratePoemInput,
):
    results = await generate_poem(data)
    return {"results": results}
