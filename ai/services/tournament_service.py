# Définition des tournois : nombre de tours, points par tour
TOURNAMENTS = {
    25: {
        "rounds": 4,
        "points": {4: 25, 3: 15, 2: 10, 1: 5}
    },
    100: {
        "rounds": 5,
        "points": {5: 100, 4: 60, 3: 40, 2: 20, 1: 10}
    },
    250: {
        "rounds": 5,
        "points": {5: 250, 4: 150, 3: 100, 2: 50, 1: 25}
    },
    500: {
        "rounds": 5,
        "points": {5: 500, 4: 300, 3: 200, 2: 100, 1: 50}
    },
    1000: {
        "rounds": 6,
        "points": {6: 1000, 5: 600, 4: 400, 3: 200, 2: 100, 1: 50}
    }
}

# fonction pour determiner si le tour actuel est le dernier tour du tournoi
def is_last_round(tournament_level, round_num):
    tournament = TOURNAMENTS.get(tournament_level)
    if not tournament:
        return False
    return round_num == tournament["rounds"]

# récupérer les points fixes en fonction du niveau du tournoi et du tour
def get_points_fixes(tournament_level, round_num):
    tournament = TOURNAMENTS.get(tournament_level)
    if not tournament:
        return 0
    return tournament["points"].get(round_num, 0)
