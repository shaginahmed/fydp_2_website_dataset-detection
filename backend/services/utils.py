def calculate_phq8_score_from_answers(phq_answers: dict):
    # phq_answers expected like {"q1": 0, ..., "q8": 2}
    score = 0
    for i in range(1, 9):
        key = f"q{i}"
        try:
            score += int(phq_answers.get(key, 0))
        except:
            score += 0

    if score <= 4:
        category = "সর্বনিম্ন বা অনুপস্থিত"
    elif score <= 9:
        category = "সামান্য"
    elif score <= 14:
        category = "মাঝারি"
    elif score <= 19:
        category = "মাঝারি থেকে গুরুতর"
    else:
        category = "গুরুতর"

    return score, category