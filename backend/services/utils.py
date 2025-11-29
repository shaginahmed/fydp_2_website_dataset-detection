# services/utils.py
def calculate_phq9_score_and_severity(answers: dict):
    """
    answers: dict with keys question1..question9 values as ints or numeric strings
    returns: (score:int, severity_label:str)
    """
    # total = 0
    # for i in range(1, 9):
    #     key = f"question{i}"
    #     val = answers.get(key, 0)
    #     try:
    #         total += int(val)
    #     except Exception:
    #         total += 0

    total = sum(int(answers.get(f"question{i}", 0)) for i in range(1, 10))

    if total <= 4:
        severity = "minimal"
    elif total <= 9:
        severity = "mild"
    elif total <= 14:
        severity = "moderate"
    elif total <= 19:
        severity = "moderately-severe"
    else:  # 20-27
        severity = "severe"

    return total, severity


