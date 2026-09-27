import re

from location import extract_location


# ==========================================
# DISASTER TYPE KEYWORDS
# ==========================================

DISASTER_KEYWORDS = {
    "flood": [
        "flood",
        "flooding",
        "flooded",
        "water entered",
        "water has entered",
        "water entering",
        "water inside",
        "waterlogging",
        "water logged",
        "heavy flooding"
    ],

    "fire": [
        "fire",
        "building caught fire",
        "burning",
        "smoke"
    ],

    "landslide": [
        "landslide",
        "fallen rocks",
        "rocks blocked",
        "mudslide"
    ]
}


# ==========================================
# EMERGENCY SIGNALS + POINTS
# ==========================================

EMERGENCY_KEYWORDS = {
    "help": 10,
    "trapped": 30,
    "injured": 30,
    "medical": 20,
    "rescue": 20,
    "children": 15,
    "elderly": 15,
    "blocked": 15,
    "emergency": 15,
    "water entering": 15,
    "water has entered": 15,
    "water inside": 15,
    "flooded": 15
}


# ==========================================
# REQUIRED HELP / NEEDS
# ==========================================

NEED_KEYWORDS = {
    "rescue": [
        "rescue",
        "trapped"
    ],

    "medical": [
        "medical",
        "injured",
        "ambulance"
    ],

    "food": [
        "food"
    ],

    "water": [
        "drinking water"
    ],

    "shelter": [
        "shelter"
    ]
}


# ==========================================
# CLEAN TEXT
# ==========================================

def clean_text(text: str) -> str:
    """
    Convert text to lowercase and remove
    unnecessary punctuation.
    """

    text = text.lower()

    text = re.sub(
        r"[^\w\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# ==========================================
# DETECT DISASTER TYPE
# ==========================================

def detect_disaster_type(text: str) -> str:

    cleaned = clean_text(text)

    scores = {
        disaster: 0
        for disaster in DISASTER_KEYWORDS
    }

    for disaster, keywords in DISASTER_KEYWORDS.items():

        for keyword in keywords:

            if keyword in cleaned:
                scores[disaster] += 1

    best_disaster = max(
        scores,
        key=scores.get
    )

    if scores[best_disaster] == 0:
        return "unknown"

    return best_disaster


# ==========================================
# DETECT EMERGENCY SIGNALS
# ==========================================

def detect_emergency(text: str):

    cleaned = clean_text(text)

    score = 0
    signals = []

    # Handle explicit negative statements
    negative_phrases = [
        "no emergency",
        "not an emergency",
        "no danger",
        "everything is safe"
    ]

    is_negative = any(
        phrase in cleaned
        for phrase in negative_phrases
    )

    if is_negative:
        return 0, []

    for keyword, points in EMERGENCY_KEYWORDS.items():

        if keyword in cleaned:

            score += points
            signals.append(keyword)

    return score, signals


# ==========================================
# DETECT REQUIRED RESOURCES
# ==========================================

def detect_needs(text: str):

    cleaned = clean_text(text)

    needs = []

    for need, keywords in NEED_KEYWORDS.items():

        for keyword in keywords:

            if keyword in cleaned:

                needs.append(need)

                break

    return needs


# ==========================================
# DISASTER BONUS
# ==========================================

DISASTER_BONUS = {
    "flood": 10,
    "fire": 30,
    "landslide": 25,
    "unknown": 0
}


# ==========================================
# COMPLETE POST ANALYSIS
# ==========================================

def analyze_post(text: str):

    disaster_type = detect_disaster_type(text)

    emergency_score, emergency_signals = (
        detect_emergency(text)
    )

    location = extract_location(text)

    needs = detect_needs(text)

    emergency_score += DISASTER_BONUS.get(
        disaster_type,
        0
    )

    return {
        "text": text,
        "disaster_type": disaster_type,
        "location": location,
        "emergency_score": emergency_score,
        "emergency_signals": emergency_signals,
        "needs": needs
    }