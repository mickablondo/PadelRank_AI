const players = [
  { id: 1, name: 'Marc Dupont', points: 1250, wins: 25, losses: 10, rank: 1 },
  { id: 2, name: 'MiK@ Blondo', points: 1180, wins: 22, losses: 12, rank: 2 },
  { id: 3, name: 'Pierre Dubois', points: 1120, wins: 20, losses: 14, rank: 3 },
  { id: 4, name: 'Sophie Laurent', points: 1050, wins: 18, losses: 15, rank: 4 },
  { id: 5, name: 'Thomas Bernard', points: 980, wins: 16, losses: 17, rank: 5 },
  { id: 6, name: 'Emma Petit', points: 920, wins: 14, losses: 18, rank: 6 },
  { id: 7, name: 'Lucas Moreau', points: 850, wins: 12, losses: 20, rank: 7 },
  { id: 8, name: 'Léa Simon', points: 780, wins: 10, losses: 22, rank: 8 },
];

class PlayerService {

    constructor() {}

    /**
     * Récupère la liste des joueurs disponibles pour les matchs
     * @returns Une liste de noms de joueurs
     */
    getPlayersNames() {
        return players.map(player => player.name);
    }

    /**
     * Récupère la liste complète des joueurs avec leurs statistiques
     * @returns Une liste d'objets joueurs contenant id, name, points, wins, losses et rank 
     */
    getPlayers() {
        return players;
    }
}

// Export d'une instance singleton pour éviter de recréer le service à chaque utilisation
export const playerService = new PlayerService();