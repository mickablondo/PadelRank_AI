// Définition des types pour les données de match envoyées à l'API
export interface MatchData {
  winnerRank: number;
  loserRank: number;
  scoreDiff: number;
  tournamentLevel: number;
  roundNum: number;
  isWinner: boolean;
}

// Définition de la réponse de l'API
export interface PointsResponse {
  points: number;
}

/**
 * Service pour interagir avec l'API IA backend
 */
class AIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000';
  }

  /**
   * Calcule les points pour un match donné
   */
  async calculatePoints(matchData: MatchData): Promise<PointsResponse> {
    const params = new URLSearchParams({
      winner_rank: matchData.winnerRank.toString(),
      loser_rank: matchData.loserRank.toString(),
      score_diff: matchData.scoreDiff.toString(),
      tournament_level: matchData.tournamentLevel.toString(),
      round_num: matchData.roundNum.toString(),
      is_winner: matchData.isWinner.toString(),
    });

    const url = `${this.baseUrl}/points?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur retournée par l'API : ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Impossible de calculer les points: ${error.message}`);
      }
      throw new Error('Erreur inconnue lors du calcul des points');
    }
  }

  /**
   * Vérifie si le service IA est disponible
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export d'une instance singleton pour éviter de recréer le service à chaque utilisation
export const aiService = new AIService();
