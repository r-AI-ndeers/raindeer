import cv2
import numpy as np
import matplotlib.pyplot as plt

def select_smallest_axis(img):
    return 0 if img.shape[0] < img.shape[1] else 1
    
def extend_img(img):
    img_large = np.zeros((img.shape[0]*2, img.shape[1]*2, img.shape[2]))
    


def resize_imgs(img, mask, res=256):
    mask = np.array(mask)
    resize_factor = img.shape[select_smallest_axis(img)]/res 
    img = cv2.resize(img, (int(img.shape[1]/resize_factor), int(img.shape[0]/resize_factor)))
    mask = cv2.resize(mask, (int(mask.shape[1]/resize_factor), int(mask.shape[0]/resize_factor)))
    
    return img, mask

def center_imgs(img, mask):

    img = cv2.copyMakeBorder(img, 200, 200, 200, 200, cv2.BORDER_CONSTANT, cv2.BORDER_CONSTANT)
    mask = cv2.copyMakeBorder(mask, 200, 200, 200, 200, cv2.BORDER_CONSTANT, cv2.BORDER_CONSTANT)
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
    img = img[:512, :512, :]
    mask = mask[:512, :512]
    return img, mask

def blur_mask(mask, kernel=13):
    mask = (((cv2.GaussianBlur(mask, (kernel, kernel), cv2.BORDER_DEFAULT)) > 0)
            * 255).astype(np.uint8)
    return mask
    
def preprocess_imgs(img, mask):
    img, mask = resize_imgs(img, mask)
    img, mask = center_imgs(img, mask)
    img, mask = crop_imgs(img, mask)
    mask = blur_mask(mask)
    return img, mask

