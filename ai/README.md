# Partie IA

TODO : prendre en compte le tour du tournoi (quart, demi, finale...) car plus important de gagner une finale (donc un tournoi) quun premier tour.

## How to use

### Commandes

```bash
# se déplacer dans le bon répertoire
cd ai
```

Ensuite, il faut créer un environnement virtuel sur VS Code : [documentation](https://code.visualstudio.com/docs/python/environments).  
Cette action créera un sous-répertoire **.venv** dans votre répertoire **ai**.

```bash
# installer les dépendances en utilisant l'environnement virtuel créé
PadelRank_AI\.venv\Scripts\python.exe -m pip install -r .\requirements.txt

# si besoin, générer un fichier CSV pour l'entraînement de l'IA
python .\generate_full_matches_csv.py

# entraîner le modèle,ce qui générera le fichier model.joblib
python train.py

# démarrer le serveur
.\.venv\Scripts\uvicorn.exe ai.app:app --reload
```

### Endpoints

| Méthode | Endpoint     | Description                                                  |
| ------- | ------------ | ------------------------------------------------------------ |
| GET     | /            | juste pour un petit bonjour.                                 |
| GET     | /favicon.ico | pour récupérer l'icône.                                      |
| GET     | /health      | pour vérifier le statut.                                     |
| GET     | /points      | pour générer et récupérer les points gagnés par le vainqueur |
