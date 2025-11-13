# services/utils.py
def calculate_phq8_score_and_severity(answers: dict):
    """
    answers: dict with keys question1..question8 values as ints or numeric strings
    returns: (score:int, severity_label:str)
    """
    total = 0
    for i in range(1, 9):
        key = f"question{i}"
        val = answers.get(key, 0)
        try:
            total += int(val)
        except Exception:
            total += 0

    if total <= 4:
        severity = 'minimal'
    elif total <= 9:
        severity = 'mild'
    elif total <= 14:
        severity = 'moderate'
    elif total <= 19:
        severity = 'moderately-severe'
    else:
        severity = 'severe'

    return total, severity


