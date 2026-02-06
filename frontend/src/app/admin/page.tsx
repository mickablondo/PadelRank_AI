'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import Navigation from '@/components/Navigation';

// TODO : supprimer la liste des joueurs et faire un vrai score en 2 sets avec tie-break + mettre niveau du tournoi + classement des joueurs pour calculer les points avec l'API IA (????) ou le trouver via API (mieux mais lourd)
const availablePlayers = [
  'Marc Dupont',
  'Julie Martin',
  'Pierre Dubois',
  'Sophie Laurent',
  'Thomas Bernard',
  'Emma Petit',
  'Lucas Moreau',
  'Léa Simon',
];

export default function AdminPage() {
  const { isConnected, address } = useAccount();
  
  const [matchData, setMatchData] = useState({
    team1Player1: '',
    team1Player2: '',
    team2Player1: '',
    team2Player2: '',
    scoreTeam1: '',
    scoreTeam2: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (!matchData.team1Player1 || !matchData.team1Player2 || 
        !matchData.team2Player1 || !matchData.team2Player2) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner tous les joueurs' });
      setSubmitting(false);
      return;
    }

    if (!matchData.scoreTeam1 || !matchData.scoreTeam2) {
      setMessage({ type: 'error', text: 'Veuillez entrer les scores' });
      setSubmitting(false);
      return;
    }

    // Simuler l'envoi des données
    setTimeout(() => {
      console.log('Résultat du match enregistré:', matchData);
      setMessage({ 
        type: 'success', 
        text: 'Résultat enregistré avec succès !' 
      });
      
      // Réinitialiser le formulaire
      setMatchData({
        team1Player1: '',
        team1Player2: '',
        team2Player1: '',
        team2Player2: '',
        scoreTeam1: '',
        scoreTeam2: '',
        date: new Date().toISOString().split('T')[0],
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
              Vous devez connecter votre portefeuille pour accéder à la page d'administration.
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
          <p className="mt-2 text-gray-600">Enregistrer les résultats des matchs</p>
          <p className="mt-1 text-sm text-gray-500">
            Connecté avec: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
          {/* Date du match : TODO qu'en faire ??? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date du match
            </label>
            <input
              type="date"
              value={matchData.date}
              onChange={(e) => setMatchData({ ...matchData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Équipe 1 */}
          <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipe 1</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joueur 1
                </label>
                <select
                  value={matchData.team1Player1}
                  onChange={(e) => setMatchData({ ...matchData, team1Player1: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {availablePlayers.map((player) => (
                    <option key={player} value={player}>{player}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joueur 2
                </label>
                <select
                  value={matchData.team1Player2}
                  onChange={(e) => setMatchData({ ...matchData, team1Player2: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {availablePlayers.map((player) => (
                    <option key={player} value={player}>{player}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Équipe 2 */}
          <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipe 2</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joueur 1
                </label>
                <select
                  value={matchData.team2Player1}
                  onChange={(e) => setMatchData({ ...matchData, team2Player1: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {availablePlayers.map((player) => (
                    <option key={player} value={player}>{player}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joueur 2
                </label>
                <select
                  value={matchData.team2Player2}
                  onChange={(e) => setMatchData({ ...matchData, team2Player2: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {availablePlayers.map((player) => (
                    <option key={player} value={player}>{player}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score final</h3>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Équipe 1
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={matchData.scoreTeam1}
                  onChange={(e) => setMatchData({ ...matchData, scoreTeam1: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Équipe 2
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={matchData.scoreTeam2}
                  onChange={(e) => setMatchData({ ...matchData, scoreTeam2: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Message de statut */}
          {message.text && (
            <div className={`rounded-lg p-4 ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
              'bg-red-50 text-red-800 border border-red-200'
            }`}>
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
