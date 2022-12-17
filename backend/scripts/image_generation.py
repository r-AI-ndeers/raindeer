import time
import numpy as np

from os.path import dirname, abspath, join
import sys

# Find code directory relative to our directory
THIS_DIR = dirname(__file__)
IMG_DIR = abspath(join(THIS_DIR, '..', 'imgs', 'test1.jpg'))

import asyncio

from src.generation.image_functions import image_pipeline


async def main():
    start_time = time.time()
    filenames = image_pipeline(
        IMG_DIR,
        multithreading_flag=True
    )
    end_time = time.time()
    print(f"image pipeline took: {np.round(end_time - start_time, 2)} seconds")
    print(filenames)


if __name__ == '__main__':
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(main())
