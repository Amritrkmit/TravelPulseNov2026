"""Travel Pulse chatbot: percentages only, never respondent counts.

Three layers (so the rule holds even if the AI model slips):
  1. agent_instructions.py tells the model not to state counts / bases.
  2. strip_counts()  removes count / base fields from the tool results BEFORE the model sees them.
  3. scrub_text()    cleans the final answer of any count that still slipped through.

Set CHAT_SHOW_COUNTS=true in .env to switch all of this off (counts and bases are shown again).
"""
import os, re

SHOW_COUNTS = os.getenv('CHAT_SHOW_COUNTS', 'false').strip().lower() in ('1', 'true', 'yes', 'on')
SMALL_BASE = 30   # below this, answers carry a "directional" note (the Read Me says small bases are directional)
SMALL_BASE_NOTE = 'Note: this is based on a small number of respondents, so treat it as directional.'

_COUNT_KEYS = {'count', 'counts', 'respondents', 'valid_base', 'missing_or_inapplicable', 'base', 'n', 'n_valid',
               'sample_size', 'rows', 'row_count', 'survey_rows', 'total_respondents'}


def strip_counts(obj):
    """Return a copy of a tool result without counts / bases; adds small_base=True where the base is under SMALL_BASE."""
    if SHOW_COUNTS:
        return obj
    if isinstance(obj, dict):
        base = obj.get('valid_base', obj.get('respondents'))
        out = {k: strip_counts(v) for k, v in obj.items() if k not in _COUNT_KEYS}
        if isinstance(base, (int, float)) and base < SMALL_BASE:
            out['small_base'] = True
        return out
    if isinstance(obj, list):
        return [strip_counts(v) for v in obj]
    return obj


def has_small_base(obj):
    if isinstance(obj, dict):
        return obj.get('small_base') is True or any(has_small_base(v) for v in obj.values())
    if isinstance(obj, list):
        return any(has_small_base(v) for v in obj)
    return False


_NUM = r'\d[\d,]*'
_PCT = r'\d+(?:\.\d+)?\s?%'
_WHO = r'(?:respondents?|people|participants?|travell?ers?)'


def scrub_text(text):
    """Remove respondent counts / sample sizes from an answer; keeps every percentage."""
    if SHOW_COUNTS or not text:
        return text
    t = str(text)
    # "29 respondents (27.9%)"  ->  "27.9%"
    t = re.sub(rf'\b{_NUM}\s+{_WHO}\s*\(\s*({_PCT})\s*\)', r'\1', t, flags=re.I)
    # "(29 respondents, 27.9%)" / "(29 respondents; 27.9%)"  ->  "(27.9%)"
    t = re.sub(rf'\(\s*{_NUM}\s+{_WHO}\s*[,;]\s*({_PCT})\s*\)', r'(\1)', t, flags=re.I)
    # "(27.9%, 29 respondents)" / "(27.9% – n=29)"  ->  "(27.9%)"
    t = re.sub(rf'\(\s*({_PCT})\s*[,;–-]\s*(?:{_NUM}\s+{_WHO}|n\s*=\s*{_NUM})\s*\)', r'(\1)', t, flags=re.I)
    # "29 (27.9%)" at the start of a value, after ':' or a dash  ->  "27.9%"
    t = re.sub(rf'(?<=[:–-]\s){_NUM}\s*\(\s*({_PCT})\s*\)', r'\1', t)
    # whole sentences about the base: "The valid base for this data is 104 respondents."
    out_lines = []
    for line in t.split('\n'):
        parts = re.split(r'(?<=[.!?])\s+', line)
        keep = []
        for s in parts:
            about_base = re.search(r'\b(?:valid\s+)?base\b|\bsample\s+size\b|\bn\s*=|\btotal\s+of\b', s, re.I)
            has_count = re.search(rf'\b{_NUM}\b', s)
            if about_base and has_count and '%' not in s:
                continue
            keep.append(s)
        out_lines.append(' '.join(keep))
    t = '\n'.join(out_lines)
    # leftovers:  "(n = 104)"  "n=104"
    t = re.sub(r'\(\s*n\s*=\s*\d[\d,]*\s*\)', '', t, flags=re.I)
    t = re.sub(r'\bn\s*=\s*\d[\d,]*', '', t, flags=re.I)
    # "among 104 respondents" -> "among the respondents";  other "104 respondents" -> "respondents"
    t = re.sub(rf'\b(among|of|from|in|for|across|with|on|by)\s+{_NUM}\s+(?:valid\s+)?{_WHO}', r'\1 the respondents', t, flags=re.I)
    t = re.sub(rf'\b{_NUM}\s+(?:valid\s+)?{_WHO}', 'respondents', t, flags=re.I)
    # tidy
    t = re.sub(r'\(\s*\)', '', t)
    t = re.sub(r'[ \t]+([,.;:])', r'\1', t)
    t = re.sub(r'[ \t]{2,}', ' ', t)
    t = re.sub(r'\n{3,}', '\n\n', t)
    return t.strip()


def finalize_answer(text, small_base=False):
    """Final clean-up of an answer: no counts, plus the 'small base' note when needed."""
    t = scrub_text(text)
    if small_base and not SHOW_COUNTS and 'small number of respondents' not in (t or ''):
        t = (t or '').rstrip() + '\n\n' + SMALL_BASE_NOTE
    return t
