import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, hardhat } from 'wagmi/chains';

// Configuration de RainbowKit et Wagmi pour la connexion au smart contract
export const config = getDefaultConfig({
  appName: 'PadelRank AI',
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '',
  chains: [
    sepolia,
    ...(process.env.NODE_ENV === 'development' ? [hardhat] : []),
  ],
  ssr: true,
});

// Export des chains pour utilisation dans l'app
export { sepolia, mainnet, hardhat };