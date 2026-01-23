import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, hardhat } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'PadelRank AI',
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '',
  chains: [hardhat], // valeur hardhat pour utilisation uniquement en local
  ssr: true,
});

// Export des chains pour utilisation dans l'app
export { hardhat };