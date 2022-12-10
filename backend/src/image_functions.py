import requests
import cv2
import numpy as np
import json
from PIL import Image
import base64
import io
import os
from torchvision.transforms import GaussianBlur
from dotenv import load_dotenv
from image_preprocessing import preprocess_imgs

from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation


def query(filename, API_URL, headers):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.request("POST", API_URL, headers=headers, data=data)
    return json.loads(response.content.decode("utf-8"))


def mask_img(img_path, API_URL, headers):
    output = query(img_path, API_URL, headers)

    #define desired labels (could change later on)
    labels = [output[i]['label'] for i in range(len(output))] #collecting all labels from the output
    not_face_labels = ['background', 'hair.png', 'hat.png', 'ear_r.png', 'ear_l.png'] #descriptions don't match actual labels in the output model, these labels are trial and error
    good_labels = [label for label in labels if label not in not_face_labels] #

    #filter only desired labels
    face_masks = []
    for elem in output:
        if elem['label'] in good_labels:
            mask_img = np.array(Image.open(io.BytesIO(base64.b64decode(elem['mask']))))
            face_masks.append(mask_img)
            
    #summing masks
    all_masks = np.zeros_like(mask_img)
    for mask in face_masks:
        all_masks += (mask>0)

    #blurring mask for soft edges
    mask = Image.fromarray(all_masks*255)
    blur = GaussianBlur(11,20)
    mask = blur(mask)
    return mask


def init_stable_diffusion(stability_token):
    os.environ['STABILITY_HOST'] = 'grpc.stability.ai:443'
    os.environ['STABILITY_KEY'] = stability_token
    stability_api = client.StabilityInference(
    key=os.environ['STABILITY_KEY'],
    verbose=True, 
    engine="stable-inpainting-v1-0", # Set the engine to use for generation. For SD 2.0 use "stable-diffusion-v2-0".
    # Available engines: stable-diffusion-v1 stable-diffusion-v1-5 stable-diffusion-512-v2-0 stable-diffusion-768-v2-0 
    # stable-diffusion-512-v2-1 stable-diffusion-768-v2-1 stable-inpainting-v1-0 stable-inpainting-512-v2-0
)
    return stability_api


def stable_diffusionize(img, mask, prompts, stability_token):
    stability_api = init_stable_diffusion(stability_token)
    
    output = stability_api.generate(
    prompt=prompts,
    init_image=Image.fromarray(img),
    mask_image=Image.fromarray(mask),
    start_schedule=1,
    samples=4,
    steps=30, 
    cfg_scale=7.5,
    width=512,
    height=512, 
    sampler=generation.SAMPLER_K_DPMPP_2M)
    
    for counter, resp in enumerate(output):
        for artifact in resp.artifacts:
#            global img3

            #if artifact.finish_reason == generation.FILTER:
            #    warnings.warn(
            #        "Your request activated the API's safety filters and could not be processed."
            #        "Please modify the prompt and try again.")

           #    img3 = Image.open(io.BytesIO(artifact.binary))
           #     filename = f"{counter}-5-completed.png"
           #     img3.save(filename)
           #     print(f'saved {filename}')
            if artifact.type == generation.ARTIFACT_IMAGE:

                img = Image.open(io.BytesIO(artifact.binary))
                filename = f"{counter}-5-completed.png"
                img.save(filename)
                print(f'saved {filename}')
    return img
 

if __name__ == '__main__':
    load_dotenv()
    huggingface_token = os.getenv("HUGGINGFACE_TOKEN")
    masking_api_url = "https://api-inference.huggingface.co/models/clearspandex/face-parsing"
    masking_api_headers = {"Authorization": f"Bearer {huggingface_token}", "wait_for_model": "True"}
    
    stability_token = os.getenv("STABLITY_TOKEN")

    img_filename = "imgs/sdss-052.jpg"
    
    img = np.array(Image.open(img_filename))
    mask = mask_img(img_filename, API_URL=masking_api_url, headers=masking_api_headers)
    mask.save("imgs/mask.jpg")
    img, mask = preprocess_imgs(img, mask)
    prompts = "A photo of santa clause, surrounded by presents, christmas tree, and a fireplace, beautiful, harmony, peace, love, joy, happiness, family, friends,"
    stable_diffusionize(img, mask, prompts, stability_token)
