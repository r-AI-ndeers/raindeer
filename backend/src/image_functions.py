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
headers = {"Authorization": f"Bearer {huggingface_token}", "wait_for_model": "True"}


def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.request("POST", API_URL, headers=headers, data=data)
    return json.loads(response.content.decode("utf-8"))


def mask_img(img_path):
    output = query(img_path)

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

 
def select_smallest_axis(img):
    return 0 if img.shape[0] < img.shape[1] else 1
    

def resize_imgs(img, mask, res=512):
    resize_factor = img.shape[select_smallest_axis(img)]/res 
    img = cv2.resize(img, (int(img.shape[1]/resize_factor), int(img.shape[0]/resize_factor)))
    mask = cv2.resize(np.array(mask), (int(img.shape[1]/resize_factor), int(img.shape[0]/resize_factor)))
    return img, mask

def center_imgs(img, mask):
    min_x = np.nonzero(mask)[1].min()
    max_x = np.nonzero(mask)[1].max()
    min_y = np.nonzero(mask)[0].min()
    max_y = np.nonzero(mask)[0].max()
    center_x = int((max_x + min_x)/2)
    center_y = int((max_y + min_y)/2)
    M = np.float32([
        [1, 0, -(center_x - 256)],
        [0, 1, -(center_y - 256)]
    ])
    img = cv2.warpAffine(img, M, (img.shape[1], img.shape[0]))
    mask = cv2.warpAffine(mask, M, (mask.shape[1], mask.shape[0]))
    return img, mask

def crop_imgs(img, mask, res=512):
    cropped_img = img[:512, :512, :]
    cropped_mask = mask[:512, :512]
    return img, mask
    
def preprocess_imgs(img, mask):
    img, mask = resize_imgs(img, mask)
    img, mask = center_imgs(img, mask)
    img, mask = crop_imgs(img, mask)
    return img, mask


if __name__ == '__main__':
    
    
    mask = mask_img("../imgs/sdss-052.jpg")
    mask.save("../imgs/mask.jpg")
