import re 

def generate_prompt(style, receiver="", likes="", interests="", verseCount=3, person="",
                    fact=""):
    PROMPT_SIMPLE = "Christmas poem to {}, they likes {} and is interested in {}, {} verses".format(
        receiver, likes, interests, verseCount)
    if style == "simple":
        return PROMPT_SIMPLE
    elif style == "personal":
        return "Write a {} paragraph Christmas poem to {} who is {} and who loves {}. {} is {}.".format(
            verseCount, receiver, person, likes, receiver, fact)
    elif style == "ghetto":
        return PROMPT_SIMPLE + ", ghetto style Christmas poem."
    elif style == "shakespeare":
        return PROMPT_SIMPLE, ", Shakespeare style Christmas poem."
    return PROMPT_SIMPLE


def normalise_poem(poem: str) -> str:
    # Find and remove all occurences of "Verse 1", "Verse 2", "Paragraph 1: etc
    normalised_poem = re.sub(r"(Verse|Paragraph) \d+\:?", "", poem)
    # collapse multiple newlines into one
    normalised_poem = re.sub(r'\n\s*\n', '\n\n', normalised_poem)

    return normalised_poem.strip()

