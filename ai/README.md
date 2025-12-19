cd ai
environnement virtuel via vs code
PadelRank_AI\.venv\Scripts\python.exe -m pip install -r .\requirements.txt
python .\generate_full_matches_csv.py pour générer un grand fichier csv
python train.py pour générer le joblib
.\.venv\Scripts\uvicorn.exe ai.app:app --reload

Ednpoints disponibles :  
/ juste pour un petit bonjour
/favicon.ico pour récupérer l'icône
/health pour vérifier le statut
/points pour générer les points gagnés par le vainqueur