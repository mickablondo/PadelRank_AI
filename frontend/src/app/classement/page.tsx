'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';

// Données de test pour le classement : TODO à supprimer
const initialPlayers = [
  { id: 1, name: 'Marc Dupont', points: 1250, wins: 25, losses: 10, rank: 1 },
  { id: 2, name: 'MiK@ Blondo', points: 1180, wins: 22, losses: 12, rank: 2 },
  { id: 3, name: 'Pierre Dubois', points: 1120, wins: 20, losses: 14, rank: 3 },
  { id: 4, name: 'Sophie Laurent', points: 1050, wins: 18, losses: 15, rank: 4 },
  { id: 5, name: 'Thomas Bernard', points: 980, wins: 16, losses: 17, rank: 5 },
  { id: 6, name: 'Emma Petit', points: 920, wins: 14, losses: 18, rank: 6 },
  { id: 7, name: 'Lucas Moreau', points: 850, wins: 12, losses: 20, rank: 7 },
  { id: 8, name: 'Léa Simon', points: 780, wins: 10, losses: 22, rank: 8 },
];

export default function ClassementPage() {
  const [players] = useState(initialPlayers);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Classement Padel</h1>
          <p className="mt-2 text-gray-600">Classement général des joueurs</p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joueur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Victoires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Défaites
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ratio V/D
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {players.map((player, index) => (
                <tr 
                  key={player.id}
                  className={index < 3 ? 'bg-yellow-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        index === 0 ? 'text-yellow-600' :
                        index === 1 ? 'text-gray-600' :
                        index === 2 ? 'text-orange-600' :
                        'text-gray-900'
                      }`}>
                        #{player.rank}
                        {index === 0 && ' 🥇'}
                        {index === 1 && ' 🥈'}
                        {index === 2 && ' 🥉'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{player.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-blue-600">{player.points}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">{player.wins}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600">{player.losses}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {(player.wins / (player.wins + player.losses)).toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Système de points</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Victoire : +50 points</li>
            <li>• Défaite : -20 points</li>
            <li>• Bonus top 3 : +10 points par semaine</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
