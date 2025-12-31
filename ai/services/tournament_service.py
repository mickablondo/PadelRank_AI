# dictionnaire de tournois avec leur nombre de tours respectifs
tournaments_rounds = {
    "p25": 4,
    "p100": 4,
    "p250": 5,
    "p500": 5,
    "p1000": 6
}

# dictionnaires des points fixes par niveau de tournoi et par tour
p25_points = {
    4: 25,
    3: 15,
    2: 10,
    1: 5
}

p100_points = {
    5: 100,
    4: 60,
    3: 40,
    2: 20,
    1: 10
}

p250_points = {
    5: 250,
    4: 150,
    3: 100,
    2: 50,
    1: 25
}

p500_points = {
    5: 500,
    4: 300,
    3: 200,
    2: 100,
    1: 50
}      

P1000_points = {
    6: 1000,
    5: 600,
    4: 400,
    3: 200,
    2: 100,
    1: 50
}

# fonction pour determiner si le tour actuel est le dernier tour du tournoi
def isLastRound(tournament_level, current_round):
    total_rounds = tournaments_rounds.get(tournament_level, 0)
    return current_round == total_rounds

# récupérer les points fixes en fonction du niveau du tournoi et du tour
def getPoints(tournament_level, round):
    if tournament_level == 25:
        return p25_points.get(round, 0)
    elif tournament_level == 100:
        return p100_points.get(round, 0)
    elif tournament_level == 250:
        return p250_points.get(round, 0)
    elif tournament_level == 500:
        return p500_points.get(round, 0)
    elif tournament_level == 1000:
        return P1000_points.get(round, 0)
    else:
        return 0
