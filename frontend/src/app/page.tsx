'use client';

import Navigation from '@/components/Navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected, address } = useAccount();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Padel Rankings
          </h1>
          <p className="text-xl text-gray-600">
            Système de classement décentralisé pour joueurs de padel
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Connexion au portefeuille
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Connectez votre portefeuille pour accéder à toutes les fonctionnalités
              </p>
            </div>

            <div className="flex justify-center w-full">
              <ConnectButton />
            </div>

            {isConnected && (
              <div className="w-full mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-center font-medium">
                  ✓ Connecté avec succès
                </p>
                <p className="text-green-600 text-sm text-center mt-1">
                  {address}
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Fonctionnalités disponibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📊 Classement</h4>
                <p className="text-sm text-blue-700">
                  Consultez le classement général des joueurs et leurs statistiques
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">⚙️ Administration</h4>
                <p className="text-sm text-purple-700">
                  Enregistrez les résultats des matchs (connexion requise)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🎾 À propos
            </h3>
            <p className="text-gray-600 max-w-md">
              Cette application permet de gérer un système de classement pour les joueurs de padel
              avec une gestion décentralisée des scores et un système intelligent d'attribution de points basé sur les performances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
