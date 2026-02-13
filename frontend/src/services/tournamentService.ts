const levels = [
  'P25',
  'P100',
  'P250',
  'P500',
  'P1000',
  'P1500',
  'P2000',
  'P2',
  'P1',
  'Major',
];

/**
 * Service pour gérer les niveaux des tournois de padel.
 */
class TournamentService {
  constructor() {}

  /**
   * Récupère la liste des niveaux de tournois disponibles
   * @returns Une liste de niveaux de tournois
   */
  getTournamentLevels() {
    return levels;
  }
}

// Export d'une instance singleton pour éviter de recréer le service à chaque utilisation
export const tournamentService = new TournamentService();
