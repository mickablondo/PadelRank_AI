"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, sepolia } from "wagmi/chains";

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;
if (!projectId) throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is missing!");

const config = getDefaultConfig({
  appName: "PadelRank_AI",
  projectId: projectId,
  chains: [mainnet, sepolia],
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
