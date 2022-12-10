import requests
import cv2
import numpy as np
import json
from PIL import Image
import base64
import io
import matplotlib.pyplot as plt
import os
from torchvision.transforms import GaussianBlur
from dotenv import load_dotenv
from image_preprocessing import preprocess_imgs

from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation

load_dotenv()
huggingface_token = os.getenv("HUGGINGFACE_TOKEN")
masking_api_url = "https://api-inference.huggingface.co/models/clearspandex/face-parsing"
#alternative model: masking_api_url = "https://api-inference.huggingface.co/models/facebook/detr-resnet-50-panoptic"

masking_api_headers = {
    "Authorization": f"Bearer {huggingface_token}", "wait_for_model": "True"}
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
    good_labels.append(['person', 'woman', 'man', 'cat', 'dog']) #in case alternative model is used

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

    mask = Image.fromarray(all_masks*255)
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


def stable_diffusionize(img, mask, prompt, stability_token):
    stability_api = init_stable_diffusion(stability_token)

    
    output = stability_api.generate(
        prompt=prompt,
        init_image=Image.fromarray(img),
        mask_image=Image.fromarray(mask),
        start_schedule=1,
        guidance_strength=0.25,
        samples=3,
        steps=30,
        cfg_scale=6.5,
        width=512,
        height=512,
        sampler=generation.SAMPLER_K_DPMPP_2M
    )
    filenames, counter = [], 0
    for resp in output:
        for artifact in resp.artifacts:
            if artifact.type == generation.ARTIFACT_IMAGE:
                img = Image.open(io.BytesIO(artifact.binary))
                filename = f"{prompt[:60]}_{counter}.png"
                img.save(filename)
                print(f'saved {filename}')
                filenames.append(filename)
                counter += 1
                
    return filenames


def image_pipeline(img_filename):

    img = np.array(Image.open(img_filename))
    mask = mask_img(img_filename, API_URL=masking_api_url,
                    headers=masking_api_headers)
    mask.save("imgs/mask.jpg")  # just some local backup for debugging
    img, mask = preprocess_imgs(img, mask)
    print("made the masking")
    input_noun = "cherry"
    prompts = [
        "a book as a present, with a person wearing a santa hat",
        "santaclaus, splash art, movie still, cinematic lighting, detailed face, dramatic, octane render, long lens, shallow depth of field, bokeh, anamorphic lens flare, 8k, hyper detailed, 35mm film grain"
        f"A christmas card, {input_noun}, with a beautiful person wearing a santa hat, ((christmas tree in the background))",
        f"A person wearing a santa hat, {input_noun}, by the beach, in the background people dancing around a fire",
        f"A handsome person ((wearing a santa hat)), {input_noun}, surrounded by presents, space ship in the background",
       f"a beautiful person, ((wearing a christmas hat)), flexing his muscles, {input_noun}, handsome, model, fit, under the stars, moon",
    ]
    all_img_filenames = []
    for prompt in prompts:
        filenames = stable_diffusionize(img, mask, prompt, stability_token)
        all_img_filenames.append(filenames)
        

if __name__ == '__main__':
    image_pipeline("imgs/Photo on 10.12.22 at 18.06.jpg")
