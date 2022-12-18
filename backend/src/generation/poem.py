import asyncio
import time
from typing import Optional

import numpy as np
import openai
import re

from pydantic import BaseModel
from revChatGPT.revChatGPT import Chatbot

from src.settings import GLOBAL_SETTINGS

class GeneratePoemInput(BaseModel):
    receiver: str
    likes: str
    fact: str
    verseCount: int
    interests: Optional[str]
    person: Optional[str]


async def generate_poem(data: GeneratePoemInput):
    promptStyles = ["personal", "street", "shakespeare"]
    t1 = time.time()

    generation_func = get_poem_from_openai
    if GLOBAL_SETTINGS.MODEL == "CHATGPT":
        generation_func = get_poem_from_chatgpt

    tasks = [generation_func(style, data) for style in promptStyles]
    results = list(await asyncio.gather(*tasks))

    t2 = time.time()
    print(f"Time taken for poem generation: {np.round(t2 - t1, 2)}")

    # Sort in the same order as promptStyles are defined
    results.sort(key=lambda x: promptStyles.index(x["style"]))
    return results


def generate_prompt(style, receiver="", likes="", interests="", verseCount=3, person="",
                    fact="") -> str:
    PROMPT_SIMPLE = "Christmas poem to {}, they likes {} and {}, {} verses".format(
        receiver, likes, fact, verseCount)
    print(PROMPT_SIMPLE)
    if style == "simple":
        return PROMPT_SIMPLE
    elif style == "personal":
        return "Write a {} paragraph Christmas poem to {} who is {} and who loves {}. {} is {}.".format(
            verseCount, receiver, person, likes, receiver, fact)
    elif style == "street":
        return PROMPT_SIMPLE + ", write it in ghetto style."
    elif style == "shakespeare":
        return PROMPT_SIMPLE + ", write it in the style of Shakespeare."

    return PROMPT_SIMPLE


def normalise_poem(poem: str) -> str:
    # Find and remove all occurences of "Verse 1", "Verse 2", "Paragraph 1: etc
    normalised_poem = re.sub(r"(Verse|Paragraph) \d+\:?", "", poem)
    # collapse multiple newlines into one
    normalised_poem = re.sub(r'\n\s*\n', '\n\n', normalised_poem)

    return normalised_poem.strip()


async def get_poem_from_openai(style, data):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=generate_prompt(style, data.receiver, data.likes, data.interests,
                               data.verseCount, data.person, data.fact),
        temperature=0.7,
        max_tokens=400,
        timeout=1000,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    result = normalise_poem(response.choices[0].text)
    return {"style": style, "poem": result}


async def get_poem_from_chatgpt(style, data):
    from src.settings import GLOBAL_SETTINGS
    email = GLOBAL_SETTINGS.CHATGPT_EMAIL
    password = GLOBAL_SETTINGS.CHATGPT_PASSWORD
    config = {
        "email": email,
        "password": password,
    }
    chatbot = Chatbot(config, conversation_id=None)
    response = chatbot.get_chat_response(
        prompt=generate_prompt(style, data.receiver, data.likes, data.interests,
                               data.verseCount, data.person, data.fact), output="text")
    text = response.get("message")

    result = normalise_poem(text)
    return {"style": style, "poem": result}
