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

load_dotenv()
huggingface_token = os.getenv("HUGGINGFACE_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/clearspandex/face-parsing"
headers = {"Authorization": f"Bearer {huggingface_token}"}


def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.request("POST", API_URL, headers=headers, data=data)
    return json.loads(response.content.decode("utf-8"))


output = query("../imgs/sdss-052.jpg")


def mask_img(img_path):
    output = query(img_path)

    labels = [output[i]['label'] for i in range(len(output))] #collecting all labels from the output
    not_face_labels = ['background', 'hair.png', 'hat.png', 'neck.png', 'ear_r.png', 'ear_l.png'] #labels that are not part of the face (no idea why we need to use ear_r.png and ear_l.png but they are shitty)

    face_masks = []
    for elem in output:
        if elem['label'] not in not_face_labels:
            mask_img = np.array(Image.open(io.BytesIO(base64.b64decode(elem['mask']))))
            face_masks.append(mask_img)
            
    #summing masks
    all_masks = np.zeros_like(mask_img)
    for mask in face_masks:
        all_masks += (mask>0)

    mask = Image.fromarray(all_masks*255)
    blur = GaussianBlur(11,20)
    mask = blur(mask)
    return mask

if __name__ == '__main__':
    mask = mask_img("../imgs/sdss-052.jpg")
    mask.save("../imgs/mask.jpg")
