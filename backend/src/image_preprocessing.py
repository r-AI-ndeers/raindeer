import cv2
import numpy as np


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

