#!/usr/bin/env python3
"""Generate the bundled Persian pronunciation library used by Dabestan."""

import asyncio
import re
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "audio" / "tts"
VOICE = "fa-IR-DilaraNeural"
LETTER_NAMES = [
    "الف", "بِ", "پِ", "تِ", "ثِ", "جیم", "چِ", "حِ", "خِ", "دال", "ذال", "رِ", "زِ", "ژِ",
    "سین", "شین", "صاد", "ضاد", "طا", "ظا", "عین", "غین", "فِ", "قاف", "کاف", "گاف",
    "لام", "میم", "نون", "واو", "هِ", "یِ",
]


def audio_name(text: str) -> str:
    return text.encode("utf-8").hex() + ".mp3"


async def generate(text: str, semaphore: asyncio.Semaphore) -> None:
    destination = OUTPUT / audio_name(text)
    if destination.exists() and destination.stat().st_size > 0:
        return
    async with semaphore:
        await edge_tts.Communicate(text, VOICE, rate="-4%").save(str(destination))


async def main() -> None:
    examples = (ROOT / "app" / "examples.ts").read_text(encoding="utf-8")
    words = re.findall(r"word: '([^']+)'", examples)
    phrases = sorted(set(words + LETTER_NAMES))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    semaphore = asyncio.Semaphore(6)
    await asyncio.gather(*(generate(text, semaphore) for text in phrases))
    print(f"Generated {len(phrases)} Persian pronunciations in {OUTPUT}")


if __name__ == "__main__":
    asyncio.run(main())
