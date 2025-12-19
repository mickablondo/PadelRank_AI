# generate_full_matches_csv.py
import pandas as pd
from pathlib import Path
import itertools

# Répertoire de sortie
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
CSV_PATH = DATA_DIR / "matches.csv"

# Variables
winner_ranks = range(1, 21)
loser_ranks = range(1, 21)
score_diffs = range(-2, 11)
tournament_levels = range(1, 6)

matches = []

for winner, loser, score, level in itertools.product(winner_ranks, loser_ranks, score_diffs, tournament_levels):
    if winner == loser:
        continue  # pas de match contre soi-même
    base_points = max(loser - winner, 1)
    score_bonus = max(score, 0)
    multiplier = 1 + (level - 1) * 0.5
    points_delta = round((base_points + score_bonus) * multiplier, 2)
    matches.append([winner, loser, score, level, points_delta])

# Créer DataFrame et sauvegarder CSV
df = pd.DataFrame(matches, columns=["winner_rank","loser_rank","score_diff","tournament_level","points_delta"])
df.to_csv(CSV_PATH, index=False)

print(f"CSV généré : {CSV_PATH} ({len(df)} lignes)")
