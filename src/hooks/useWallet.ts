"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export function useWallet() {
  const { data: account } = useAbstraxionAccount();
  const { client: signingClient } = useAbstraxionSigningClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize wallet connection
  useEffect(() => {
    setLoading(false);
  }, [account]);

  const disconnect = useCallback(() => {
    // Account Abstraxion handles disconnection through its UI
    localStorage.removeItem("walletConnected");
  }, []);

  return {
    account: account?.bech32Address ?? null,
    signingClient,
    loading,
    error,
    disconnect,
  };
}
