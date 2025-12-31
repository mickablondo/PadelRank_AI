from xmlrpc.client import boolean
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pathlib import Path
import joblib
import numpy as np
import logging

from ai.services.tournament_service import get_points_fixes, is_last_round

# Configure le logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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
    tournament_level: int,
    round_num: int,
    is_winner: boolean
):
    features = [[winner_rank, loser_rank, score_diff, tournament_level]]
    prediction = model.predict(features)

    # si perdant alors juste points fixes
    if(not is_winner):
        logger.info(f"1 - is_winner: {is_winner}, round: {round_num}, tournament: {tournament_level}")
        return {"points": get_points_fixes(tournament_level, round_num)}
    else:
        if(is_last_round(tournament_level, round_num)): # si vainqueur et dernier tour alors points fixes + bonus
            logger.info(f"2 - is_winner: {is_winner}, round: {round_num}, tournament: {tournament_level}")
            return {"points": round(float(prediction[0]) + get_points_fixes(tournament_level, round_num), 2)}
        else: # si vainqueur mais pas dernier tour alors juste bonus
            logger.info(f"3 - is_winner: {is_winner}, round: {round_num}, tournament: {tournament_level}")
            return {"points": round(float(prediction[0]), 2)}
