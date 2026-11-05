#!/usr/bin/env python3
"""Build the static English loanword dictionary from public Wiktionary data."""

from __future__ import annotations

import html
import json
import re
import time
import urllib.parse
import urllib.request
import urllib.error
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "app" / "persian-loanwords-data.ts"
API = "https://en.wiktionary.org/w/api.php"
CATEGORIES = [
    "English terms borrowed from Persian",
    "English terms derived from Iranian Persian",
    "English terms borrowed from Classical Persian",
]
LANGUAGES = {
    "ar": "Arabic", "fa": "Persian", "fa-cls": "Classical Persian", "fr": "French",
    "frm": "Middle French", "fro": "Old French", "hi": "Hindi", "ur": "Urdu",
    "ota": "Ottoman Turkish", "tr": "Turkish", "sa": "Sanskrit", "grc": "Ancient Greek",
    "la": "Latin", "it": "Italian", "pt": "Portuguese", "es": "Spanish", "nl": "Dutch",
    "enm": "Middle English", "de": "German", "ru": "Russian", "pal": "Middle Persian",
    "peo": "Old Persian", "ps": "Pashto", "raj": "Rajasthani", "pa": "Punjabi",
}
PERSIAN_RE = re.compile(r"[\u0600-\u06ff]")


def api(params: dict[str, str]) -> dict:
    query = urllib.parse.urlencode({**params, "format": "json", "formatversion": "2"})
    request = urllib.request.Request(f"{API}?{query}", headers={"User-Agent": "DabestanDictionary/1.0 (educational static site)"})
    for attempt in range(6):
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 5:
                raise
            time.sleep(5 * (attempt + 1))
    raise RuntimeError("Unreachable retry state")


def category_titles(name: str) -> list[str]:
    titles: list[str] = []
    continuation: str | None = None
    while True:
        params = {
            "action": "query", "list": "categorymembers", "cmtitle": f"Category:{name}",
            "cmtype": "page", "cmlimit": "500",
        }
        if continuation:
            params["cmcontinue"] = continuation
        payload = api(params)
        titles.extend(item["title"] for item in payload["query"]["categorymembers"])
        continuation = payload.get("continue", {}).get("cmcontinue")
        if not continuation:
            return titles


def english_section(text: str) -> str:
    match = re.search(r"^==English==\s*$", text, re.MULTILINE)
    if not match:
        return ""
    rest = text[match.end():]
    end = re.search(r"^==[^=].*==\s*$", rest, re.MULTILINE)
    return rest[:end.start()] if end else rest


def clean_wiki(value: str) -> str:
    value = re.sub(r"<!--.*?-->", "", value, flags=re.DOTALL)
    value = re.sub(r"<ref[^>]*>.*?</ref>|<ref[^>]*/>", "", value, flags=re.DOTALL)
    value = re.sub(r"\{\{(?:lb|label)\|en\|([^}]+)\}\}", lambda m: f"({', '.join(m.group(1).split('|'))}) ", value)
    value = re.sub(r"\{\{(?:gloss|sense)\|([^}]+)\}\}", r"(\1)", value)
    value = re.sub(r"\{\{(?:m|l)\|[^|}]+\|([^|}]+)(?:\|[^}]*)?\}\}", r"\1", value)
    value = re.sub(r"\{\{[^{}]*\|([^|{}]+)\}\}", r"\1", value)
    value = re.sub(r"\{\{[^{}]+\}\}", "", value)
    value = re.sub(r"\[\[[^]|]+\|([^]]+)\]\]", r"\1", value)
    value = re.sub(r"\[\[([^]]+)\]\]", r"\1", value)
    value = re.sub(r"'{2,}", "", value)
    value = re.sub(r"<[^>]+>", "", value)
    value = html.unescape(value)
    value = re.sub(r"^Q\d+\s+", "", value)
    return re.sub(r"\s+", " ", value).strip(" .;:")


def source_from(section: str) -> tuple[str, str]:
    etymology = re.search(r"===Etymology(?: \d+)?===\s*(.*?)(?=^===)", section, re.MULTILINE | re.DOTALL)
    source_text = etymology.group(1) if etymology else section[:2500]
    patterns = [
        r"\{\{(?:der|bor|inh|uder|l|m|cog|noncog)\|en\|(fa|fa-cls|fa-ira|pal|peo)\|([^|}]+)([^}]*)\}\}",
        r"\{\{(?:der|bor|inh|uder|l|m|cog|noncog)\|(?:fa|fa-cls|fa-ira|pal|peo)\|([^|}]+)([^}]*)\}\}",
    ]
    for pattern in patterns:
        matches = list(re.finditer(pattern, source_text))
        if not matches:
            continue
        match = matches[-1]
        if len(match.groups()) == 3:
            term, rest = match.group(2), match.group(3)
        else:
            term, rest = match.group(1), match.group(2)
        term = clean_wiki(term)
        transliteration = re.search(r"(?:^|\|)tr=([^|}]+)", rest)
        if term and not term.startswith(("Appendix:", "Category:")):
            return term, clean_wiki(transliteration.group(1)) if transliteration else ""
    return "", ""


def first_definition(section: str) -> tuple[str, str]:
    for match in re.finditer(r"^# (?![:*#])(.*)$", section, re.MULTILINE):
        definition = clean_wiki(match.group(1))
        if not definition or definition.lower().startswith(("alternative form", "plural of", "obsolete spelling")):
            continue
        heading_matches = list(re.finditer(r"^===(?!Etymology|Pronunciation)([^=]+)===\s*$", section[:match.start()], re.MULTILINE))
        part = heading_matches[-1].group(1).strip() if heading_matches else "Word"
        return definition[:240], re.sub(r" \d+$", "", part)
    return "An English term with a documented Persian origin.", "Word"


def route_from(section: str) -> str:
    etymology = re.search(r"===Etymology(?: \d+)?===\s*(.*?)(?=^===)", section, re.MULTILINE | re.DOTALL)
    source_text = etymology.group(1) if etymology else section[:1800]
    codes = re.findall(r"\{\{(?:der|bor|inh)\|en\|([a-z-]+)\|", source_text)
    route: list[str] = []
    for code in reversed(codes):
        language = LANGUAGES.get(code)
        if language and language not in route:
            route.append(language)
    if not any("Persian" in language for language in route):
        route.insert(0, "Persian")
    route.append("English")
    return " → ".join(route[:5])


def parse_page(title: str, text: str) -> dict[str, str] | None:
    section = english_section(text)
    if not section:
        return None
    source, transliteration = source_from(section)
    definition, part = first_definition(section)
    proper = "Proper noun" in part or "{{surname|en" in section or "{{given name|en" in section
    return {
        "english": title,
        "persian": source or "—",
        "transliteration": transliteration or title.lower(),
        "definition": definition,
        "partOfSpeech": part,
        "route": route_from(section),
        "proper": proper,
        "sourceUrl": f"https://en.wiktionary.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}#English",
    }


def main() -> None:
    titles = sorted({title for category in CATEGORIES for title in category_titles(category)}, key=str.casefold)
    entries: list[dict[str, str]] = []
    for offset in range(0, len(titles), 50):
        batch = titles[offset:offset + 50]
        payload = api({
            "action": "query", "prop": "revisions", "rvprop": "content", "rvslots": "main",
            "titles": "|".join(batch),
        })
        for page in payload.get("query", {}).get("pages", []):
            revisions = page.get("revisions") or []
            if not revisions:
                continue
            entry = parse_page(page["title"], revisions[0]["slots"]["main"]["content"])
            if entry:
                entries.append(entry)
        time.sleep(1.25)

    entries.sort(key=lambda item: (item["proper"], item["persian"] == "—", item["english"].casefold()))
    if len(entries) < 500:
        raise SystemExit(f"Only {len(entries)} entries with a Persian source were found; 500 required")
    selected = entries[:500]
    for item in selected:
        item.pop("proper", None)

    output = "export type PersianLoanword = {\n  english: string;\n  persian: string;\n  transliteration: string;\n  definition: string;\n  partOfSpeech: string;\n  route: string;\n  sourceUrl: string;\n};\n\n"
    output += "export const persianLoanwords: PersianLoanword[] = "
    output += json.dumps(selected, ensure_ascii=False, indent=2)
    output += ";\n"
    OUTPUT.write_text(output, encoding="utf-8")
    print(f"Wrote {len(selected)} entries to {OUTPUT}")


if __name__ == "__main__":
    main()
