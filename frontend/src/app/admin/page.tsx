'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import Navigation from '@/components/Navigation';
import { playerService } from '@/services/playerService';
import { tournamentService } from '@/services/tournamentService';
import { getFieldFromLabel } from '@/utils/fieldToLabel';

// TODO-list :
// - Ajouter un champ pour le niveau du tournoi (ex: Open, Challenger, Future)
// - Lorsqu'un joueur est sélectionné dans une équipe, le retirer de la liste de sélection de l'autre équipe pour éviter les doublons
// - Adapter le formulaire pour l'appel à l'API IA : winner_rank (à ajouter), loser_rank (à ajouter), score_diff (se calcule par rapport aux jeux indiqués), tournament_level (à ajouter), round_num (à ajouter), is_winner (se devine par le score indiqué)
// - Joueur identifié par une licence plutôt que par son nom (pour éviter les problèmes de doublons de noms) => adapter le formulaire pour afficher les licences plutôt que les noms, et faire la correspondance licence <-> nom dans le service playerService

/**
 * Page d'administration pour enregistrer les résultats des matchs de padel.
 * Accessible uniquement aux utilisateurs connectés avec leur portefeuille.
 *
 * @returns JSX.Element - Composant de la page d'administration
 */
export default function AdminPage() {
  const { isConnected, address } = useAccount();

  const [matchData, setMatchData] = useState({
    team1Player1: '',
    team1Player2: '',
    team2Player1: '',
    team2Player2: '',
    scoreSet1Team1: '',
    scoreSet1Team2: '',
    scoreSet2Team1: '',
    scoreSet2Team2: '',
    scoreSet3Team1: '',
    scoreSet3Team2: '',
    date: new Date().toISOString().split('T')[0],
    level: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const availablePlayers = playerService.getPlayersNames();

  /**
   * Valide les données du match.
   * @param data - Les données du match à valider
   * @returns Un objet contenant un booléen indiquant si les données sont valides et un tableau d'erreurs
   */
  const validateMatchData = (data: typeof matchData) => {
    const errors: string[] = [];

    const players = [
      data.team1Player1,
      data.team1Player2,
      data.team2Player1,
      data.team2Player2,
    ];

    // Vérification d'unicité des joueurs (pas de doublons entre les équipes)
    const uniquePlayers = new Set(players);
    if (uniquePlayers.size < 4) {
      errors.push(
        "Chaque joueur ne doit être présent qu'une seule fois dans le match"
      );
    }

    // Vérifier que les valeurs de scores sont numériques et raisonnables
    const allScoreFields = [
      'scoreSet1Team1',
      'scoreSet1Team2',
      'scoreSet2Team1',
      'scoreSet2Team2',
      'scoreSet3Team1',
      'scoreSet3Team2',
    ];
    for (const key of allScoreFields) {
      const val = (data as any)[key];
      if (val !== '' && val !== undefined) {
        const n = Number(val);
        if (Number.isNaN(n)) {
          errors.push(`Score invalide pour ${getFieldFromLabel(key)}`);
        } else if (n < 0 || n > 7) {
          // amélioration : cohérence entre le score des deux équipes pour un même set (ex: 6-0, 7-5, et non 7-4, 6-6 ou 5-2)
          errors.push(`Score hors plage pour ${getFieldFromLabel(key)}`);
        }
      }
    }

    return { valid: errors.length === 0, errors } as const;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // pour empêcher le rechargement de la page lors de la soumission du formulaire
    setSubmitting(true); // pour désactiver le bouton de validation
    setMessage({ type: '', text: '' });

    // Validation centralisée via validateMatchData
    const { valid, errors } = validateMatchData(matchData);
    if (!valid) {
      setMessage({ type: 'error', text: errors.join(' — ') });
      setSubmitting(false);
      return;
    }

    // TODO : appeler l'API pour connaître les points + API pourenregistrer le résultat du match
    // Simuler l'envoi des données
    setTimeout(() => {
      console.log('Résultat du match enregistré:', matchData);
      setMessage({
        type: 'success',
        text: 'Résultat enregistré avec succès !',
      });

      // Réinitialiser le formulaire
      setMatchData({
        team1Player1: '',
        team1Player2: '',
        team2Player1: '',
        team2Player2: '',
        scoreSet1Team1: '',
        scoreSet1Team2: '',
        scoreSet2Team1: '',
        scoreSet2Team2: '',
        scoreSet3Team1: '',
        scoreSet3Team2: '',
        date: new Date().toISOString().split('T')[0],
        level: '',
      });

      setSubmitting(false);
    }, 1000);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Accès restreint
            </h2>
            <p className="text-gray-700 mb-6">
              Vous devez connecter votre portefeuille pour accéder à la page
              d'administration.
            </p>
            <p className="text-sm text-gray-600">
              Retournez à la page d'accueil pour vous connecter.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="mt-2 text-gray-600">
            Enregistrer les résultats des matchs
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Connecté avec: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 space-y-6"
        >
          {/* Date du match : TODO qu'en faire ??? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date du match
            </label>
            <input
              type="date"
              value={matchData.date}
              onChange={(e) =>
                setMatchData({ ...matchData, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Niveau du tournoi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau du tournoi
            </label>
            <select
              value={matchData.level}
              onChange={(e) =>
                setMatchData({ ...matchData, level: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner...</option>
              {tournamentService.getTournamentLevels().map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Équipe 1 */}
          <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Équipe 1
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joueur 1
                </label>
                <select
                  value={matchData.team1Player1}
                  onChange={(e) =>
                    setMatchData({ ...matchData, team1Player1: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {availablePlayers.map((player) => (
                    <option key={player} value={player}>
                      {player}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joueur 2
                </label>
                <select
                  value={matchData.team1Player2}
                  onChange={(e) =>
                    setMatchData({ ...matchData, team1Player2: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {availablePlayers.map((player) => (
                    <option key={player} value={player}>
                      {player}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Équipe 2 */}
          <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Équipe 2
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joueur 1
                </label>
                <select
                  value={matchData.team2Player1}
                  onChange={(e) =>
                    setMatchData({ ...matchData, team2Player1: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {availablePlayers.map((player) => (
                    <option key={player} value={player}>
                      {player}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joueur 2
                </label>
                <select
                  value={matchData.team2Player2}
                  onChange={(e) =>
                    setMatchData({ ...matchData, team2Player2: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {availablePlayers.map((player) => (
                    <option key={player} value={player}>
                      {player}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Score final
            </h3>

            {/* En-têtes des colonnes */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-2">
              <div></div> {/* Colonne vide pour les labels de sets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 text-center">
                  Équipe 1
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 text-center">
                  Équipe 2
                </label>
              </div>
            </div>

            {/* Set 1 */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-2">
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700">
                  Set 1
                </label>
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={matchData.scoreSet1Team1}
                  onChange={(e) =>
                    setMatchData({
                      ...matchData,
                      scoreSet1Team1: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={matchData.scoreSet1Team2}
                  onChange={(e) =>
                    setMatchData({
                      ...matchData,
                      scoreSet1Team2: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Set 2 */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-2">
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700">
                  Set 2
                </label>
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={matchData.scoreSet2Team1}
                  onChange={(e) =>
                    setMatchData({
                      ...matchData,
                      scoreSet2Team1: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={matchData.scoreSet2Team2}
                  onChange={(e) =>
                    setMatchData({
                      ...matchData,
                      scoreSet2Team2: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Set 3 */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700">
                  Set 3
                </label>
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={matchData.scoreSet3Team1}
                  onChange={(e) =>
                    setMatchData({
                      ...matchData,
                      scoreSet3Team1: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={matchData.scoreSet3Team2}
                  onChange={(e) =>
                    setMatchData({
                      ...matchData,
                      scoreSet3Team2: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Message de statut */}
          {message.text && (
            <div
              className={`rounded-lg p-4 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Validation du formulaire */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? 'Enregistrement...' : 'Enregistrer le résultat'}
          </button>
        </form>
      </div>
    </div>
  );
}
