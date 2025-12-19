# train.py – Entraînement du modèle ML pour le scoring padel
from pathlib import Path
import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

# 1️⃣ Charger les données
BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "matches.csv"

data = pd.read_csv(DATA_PATH)

# 2️⃣ Définir les features et la cible
X = data[[
    "winner_rank",
    "loser_rank",
    "score_diff",
    "tournament_level"
]]

y = data["points_delta"]
 
# 3️⃣ Entraîner le modèle
model = LinearRegression()
model.fit(X, y)

# 4️⃣ Sauvegarder le modèle
joblib.dump(model, BASE_DIR / "model.joblib")

print("model.joblib créé")
