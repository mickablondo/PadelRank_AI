"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;
if (!projectId) throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is missing!");

const config = getDefaultConfig({
  appName: "PadelRank AI",
  projectId: projectId,
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
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