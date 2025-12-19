from fastapi import FastAPI
from fastapi.responses import FileResponse
from pathlib import Path
import joblib
import numpy as np

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent
FAVICON_PATH = BASE_DIR / "static" / "favicon.ico"
MODEL_PATH = BASE_DIR / "model.joblib"

model = joblib.load(MODEL_PATH)

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return FileResponse(FAVICON_PATH)

@app.get("/")
def read_root():
    return {"message": "Hello depuis ai 🚀"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/points")
def get_points(
    winner_rank: int,
    loser_rank: int,
    score_diff: int,
    tournament_level: int
):
    features = [[winner_rank, loser_rank, score_diff, tournament_level]]
    prediction = model.predict(features)
    return {"points": round(float(prediction[0]), 2)}