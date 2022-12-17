from datetime import time

import numpy as np

from backend.src.generation.image_functions import image_pipeline
import asyncio


async def main():
    start_time = time.time()
    filenames = await image_pipeline("imgs/Photo on 10.12.22 at 18.06.jpg",
                                     multithreading_flag=False)
    end_time = time.time()
    print(f"image pipeline took: {np.round(end_time - start_time, 2)} seconds")
    print(filenames)


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
