from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List

import requests
import numpy as np
import json
from PIL import Image, ImageOps
import base64
import io
import os
from dotenv import load_dotenv
from src.generation.image_preprocessing import preprocess_imgs

from src.settings import GLOBAL_SETTINGS
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation
from src.s3_functions import S3_UPLOADER

load_dotenv()
huggingface_token = GLOBAL_SETTINGS.HUGGINGFACE_TOKEN

MASKING_API_URL = "https://api-inference.huggingface.co/models/clearspandex/face-parsing"
# alternative model: MASKING_API_URL = "https://api-inference.huggingface.co/models/facebook/detr-resnet-50-panoptic"

masking_api_headers = {
    "Authorization": f"Bearer {huggingface_token}", "wait_for_model": "True"
}
stability_token = os.getenv("STABLITY_TOKEN")


def query(filename, API_URL, headers):
    with open(filename, "rb") as f:
        img = base64.b64encode(f.read())

    data = {}
    data['inputs'] = img.decode()
    data['options'] = {'wait_for_model': True}

    response = requests.request(
        "POST", API_URL, headers=headers, data=json.dumps(data))
    return json.loads(response.content.decode("utf-8"))


def mask_img(img_path, API_URL, headers):
    output = query(img_path, API_URL, headers)

    # define desired labels (could change later on)
    # collecting all labels from the output
    labels = [output[i]['label'] for i in range(len(output))]
    # descriptions don't match actual labels in the output model!! These labels are trial and error. Can be checked here: https://huggingface.co/clearspandex/face-parsing
    not_face_labels = ['background', 'hat.png',
                       'ear_r.png', 'ear_l.png', 'hair.png']
    good_labels = [label for label in labels if label not in not_face_labels]
    good_labels.append(
        ['person', 'woman', 'man', 'cat', 'dog'])  # in case alternative model is used

    # filter only desired labels
    face_masks = []
    for elem in output:
        if elem['label'] in good_labels:
            mask_img = np.array(Image.open(
                io.BytesIO(base64.b64decode(elem['mask']))))
            face_masks.append(mask_img)

    # summing masks
    all_masks = np.zeros_like(mask_img)
    for mask in face_masks:
        all_masks += (mask > 0)

    mask = Image.fromarray(all_masks * 255)
    return mask


def init_stable_diffusion(stability_token):
    os.environ['STABILITY_HOST'] = 'grpc.stability.ai:443'
    os.environ['STABILITY_KEY'] = stability_token
    stability_api = client.StabilityInference(
        key=os.environ['STABILITY_KEY'],
        verbose=True,
        engine="stable-inpainting-v1-0",
        # Available engines: stable-diffusion-v1 stable-diffusion-v1-5 stable-diffusion-512-v2-0 stable-diffusion-768-v2-0
        # stable-diffusion-512-v2-1 stable-diffusion-768-v2-1 stable-inpainting-v1-0 stable-inpainting-512-v2-0
    )
    return stability_api


def stable_diffusionize(img, mask, prompt, stability_token, S3_UPLOADER) -> List[
    str]:
    stability_api = init_stable_diffusion(stability_token)

    output = stability_api.generate(
        prompt=prompt,
        init_image=Image.fromarray(img),
        mask_image=Image.fromarray(mask),
        start_schedule=1,
        # guidance_strength=0.25,
        samples=3,
        steps=30,
        cfg_scale=7,
        width=512,
        height=512,
        sampler=generation.SAMPLER_K_DPMPP_2M
    )
    urls, counter = [], 0
    for resp in output:
        for artifact in resp.artifacts:
            if artifact.finish_reason == generation.FILTER:
                print("nsfw filter hit")

            elif artifact.type == generation.ARTIFACT_IMAGE:
                img = Image.open(io.BytesIO(artifact.binary))
                # filename = f"{prompt[:60]}_{counter}.png"
                # img.save(filename)
                # print(f'saved {filename}')
                # filenames.append(filename)
                # counter += 1
                url = S3_UPLOADER.upload_to_s3(img)
                urls.append(url)
                counter += 1

    return urls


def image_pipeline(img_filename, multithreading_flag=True):
    img = Image.open(img_filename)
    # Fix the exif orientation
    img = ImageOps.exif_transpose(img)

    img = np.array(img)
    mask = mask_img(img_filename, API_URL=MASKING_API_URL,
                    headers=masking_api_headers)
    # mask.save("imgs/mask.jpg")  # just some local backup for debugging
    img, mask = preprocess_imgs(img, mask)
    print("made the masking")
    prompts = [
        f"Beautiful person, oil painting, ((wearing a christmas hat)), flexing his muscles, handsome, model, fit, under the stars, moon",
        "person with reindeer horns, great resolution, forest in background",
        "cyberpunk christmas image. a person with santa hat, christmas tree, this pastel painting by the award - winning children's book author has interesting color contrasts, plenty of details and impeccable lighting. great resolution | hands:-1.0",
        "Pencil drawing, portrait and gifts, christmassy setting, beach boy | hands:-1.0",
        "Christmassy portrait, in a suit with santa clause hat, oil painting, christmas tree in back",
        f"A Person with a lot of christmas food, realistic, 4k",
        f"A handsome person ((wearing a santa hat and an ugly christmas sweater)), pixel art, surrounded by presents, space ship in the background",
    ]
    all_img_urls = []
    threads = []
    if not multithreading_flag:
        for prompt in prompts:
            urls = stable_diffusionize(img, mask, prompt, stability_token,
                                                  S3_UPLOADER)
            all_img_urls.extend(urls)
    else:
        with ThreadPoolExecutor(max_workers=7) as executor:
            for prompt in prompts:
                threads.append(executor.submit(stable_diffusionize, img, mask,
                                               prompt, stability_token, S3_UPLOADER))

            try:

                for task in as_completed(threads, timeout=15):
                    urls = task.result()
                    all_img_urls.extend(urls)

            except Exception as e:
                print(e)
                for task in threads:
                    task.cancel()

    return all_img_urls
