"use client";

import { useCallback, useEffect, useState } from "react";
import { connect } from "get-starknet";
import { AccountInterface, ProviderInterface } from "starknet";

export function useWallet() {
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [provider, setProvider] = useState<ProviderInterface | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const silentConnect = async () => {
    try {
      const starknet = await connect({
        modalMode: "neverAsk",
      });

      if (starknet?.isConnected && starknet.selectedAddress) {
        await starknet.enable({
          starknetVersion: "v5",
          network: "sepolia-1",
        });

        setProvider(starknet.provider);
        setAccount(starknet.account);
        setAddress(starknet.selectedAddress);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Silent connect failed:", err);
      return false;
    }
  };

  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const starknet = await connect({
        modalMode: "alwaysAsk",
        webWalletUrl: "https://web.argent.xyz",
      });

      if (!starknet) {
        throw new Error("Failed to connect to wallet");
      }

      await starknet.enable({ starknetVersion: "v5", network: "sepolia-1" });

      setProvider(starknet.provider);
      setAccount(starknet.account);
      setAddress(starknet.selectedAddress);

      // Save connection state
      localStorage.setItem("walletConnected", "true");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize wallet connection
  useEffect(() => {
    const init = async () => {
      try {
        const wasConnected = localStorage.getItem("walletConnected") === "true";
        if (wasConnected) {
          const connected = await silentConnect();
          if (!connected) {
            localStorage.removeItem("walletConnected");
          }
        }
      } catch (err) {
        console.error("Failed to initialize wallet:", err);
        localStorage.removeItem("walletConnected");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Listen for wallet changes
  useEffect(() => {
    let starknet: any = null;
    let mounted = true;

    const setupListeners = async () => {
      try {
        starknet = await connect({ modalMode: "neverAsk" });
        if (!starknet || !mounted) return;

        const handleAccountsChange = (accounts: string[]) => {
          if (!mounted) return;

          if (accounts.length === 0) {
            setAddress(null);
            setAccount(null);
            localStorage.removeItem("walletConnected");
          } else {
            setAddress(accounts[0]);
            localStorage.setItem("walletConnected", "true");
          }
        };

        const handleNetworkChange = ({
          network,
          chain,
        }: {
          network: string;
          chain: string;
        }) => {
          if (!mounted) return;
          console.log("Network changed:", network, chain);
          // Optionally handle network changes
          silentConnect(); // Reconnect on network change
        };

        starknet.on("accountsChanged", handleAccountsChange);
        starknet.on("networkChanged", handleNetworkChange);
      } catch (error) {
        console.error("Failed to setup wallet listeners:", error);
      }
    };

    setupListeners();

    return () => {
      mounted = false;
      if (starknet) {
        starknet.off("accountsChanged", () => {});
        starknet.off("networkChanged", () => {});
      }
    };
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setAccount(null);
    setProvider(null);
    localStorage.removeItem("walletConnected");
  }, []);

  return {
    connectWallet,
    disconnect,
    account,
    provider,
    address,
    loading,
    error,
    isConnected: !!address,
  };
}
