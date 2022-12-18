import cv2
import numpy as np


def select_smallest_axis(img):
    return 0 if img.shape[0] < img.shape[1] else 1


def extend_img(img):
    img_large = np.zeros((img.shape[0] * 2, img.shape[1] * 2, img.shape[2]))


def count_faces(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faceCascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.3,
        minNeighbors=3,
        minSize=(50, 50))
    output = len(faces) if not len(faces) == 0 else 1
    return output


def resize_imgs(img, mask, res=300):
    mask = np.array(mask)
    # resize_factor = img.shape[select_smallest_axis(img)]/res
    # img = cv2.resize(img, (int(img.shape[1]/resize_factor), int(img.shape[0]/resize_factor)))
    # mask = cv2.resize(mask, (int(mask.shape[1]/resize_factor), int(mask.shape[0]/resize_factor)))
    desired_face_px_count = 20000  # completely empirical value
    current_face_px_count = len(mask.nonzero()[1])
    # number_of_faces = count_faces(img)

    print(f'current face px count: {current_face_px_count}')
    face_size_factor = np.sqrt(current_face_px_count / desired_face_px_count)
    mask = cv2.resize(mask, (
    int(mask.shape[1] / face_size_factor), int(mask.shape[0] / face_size_factor)))
    img = cv2.resize(img, (
    int(img.shape[1] / face_size_factor), int(img.shape[0] / face_size_factor)))
    print(f'updated size, face px count now: {len(mask.nonzero()[1])}')

    return img, mask


def center_imgs(img, mask):
    img = cv2.copyMakeBorder(img, 300, 300, 300, 300, cv2.BORDER_CONSTANT,
                             cv2.BORDER_CONSTANT)
    mask = cv2.copyMakeBorder(mask, 300, 300, 300, 300, cv2.BORDER_CONSTANT,
                              cv2.BORDER_CONSTANT)

    min_x = np.nonzero(mask)[1].min()
    max_x = np.nonzero(mask)[1].max()
    min_y = np.nonzero(mask)[0].min()
    max_y = np.nonzero(mask)[0].max()
    center_x = int((max_x + min_x) / 2)
    center_y = int((max_y + min_y) / 2)
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


def blur_mask(mask, kernel=17):
    mask = ((cv2.GaussianBlur(mask, (kernel, kernel), cv2.BORDER_DEFAULT))).astype(
        np.uint8)
    return mask


def preprocess_imgs(img, mask):
    img, mask = resize_imgs(img, mask)
    img, mask = center_imgs(img, mask)
    img, mask = crop_imgs(img, mask)
    mask = blur_mask(mask)
    
    return img, mask
