"use client";

import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import "@burnt-labs/abstraxion/dist/index.css";

export function AbstraxionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AbstraxionProvider
      config={{
        rpcEndpoint: "https://rpc.xion-testnet-1.burnt.com",
      }}
    >
      {children}
    </AbstraxionProvider>
  );
}
