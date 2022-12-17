from fastapi import UploadFile, File

from src.generation.image_functions import image_pipeline
from fastapi import APIRouter

router = APIRouter()


@router.post("/generate/image")
def generate_image(
    file: UploadFile = File(...),
):
    file_location = f"{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    urls = image_pipeline(file_location)

    return {"results": urls}
