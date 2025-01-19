"use client";

import { useCallback, useState } from "react";
import { useWallet } from "./useWallet";
import { Coin } from "@cosmjs/stargate";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export function useMusicToken() {
  const { account, signingClient } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMusicToken = useCallback(
    async (initialPrice: string, metadataUri: string) => {
      if (!signingClient || !account || !CONTRACT_ADDRESS) {
        throw new Error("Wallet not connected or contract address not set");
      }

      try {
        setLoading(true);
        setError(null);

        const msg = {
          create_music_token: {
            initial_price: initialPrice,
            metadata_uri: metadataUri,
          },
        };

        const response = await signingClient.execute(
          account,
          CONTRACT_ADDRESS,
          msg,
          "auto"
        );

        return response;
      } catch (err) {
        console.error("Failed to create music token:", err);
        setError(
          err instanceof Error ? err.message : "Failed to create music token"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [signingClient, account]
  );

  const purchaseTokens = useCallback(
    async (tokenId: number, amount: string, price: string) => {
      if (!signingClient || !account || !CONTRACT_ADDRESS) {
        throw new Error("Wallet not connected or contract address not set");
      }

      try {
        setLoading(true);
        setError(null);

        const msg = {
          purchase_tokens: {
            token_id: tokenId,
            amount: amount,
          },
        };

        const funds: Coin[] = [
          {
            denom: "uxion",
            amount: price,
          },
        ];

        const response = await signingClient.execute(
          account,
          CONTRACT_ADDRESS,
          msg,
          "auto",
          undefined,
          funds
        );

        return response;
      } catch (err) {
        console.error("Failed to purchase tokens:", err);
        setError(
          err instanceof Error ? err.message : "Failed to purchase tokens"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [signingClient, account]
  );

  const getTokenData = useCallback(
    async (tokenId: number) => {
      if (!signingClient || !CONTRACT_ADDRESS) {
        throw new Error("Client not available or contract address not set");
      }

      try {
        setLoading(true);
        setError(null);

        const msg = {
          get_token_data: {
            token_id: tokenId,
          },
        };

        const response = await signingClient.queryContractSmart(
          CONTRACT_ADDRESS,
          msg
        );
        return response;
      } catch (err) {
        console.error("Failed to get token data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to get token data"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [signingClient]
  );

  const calculateCurrentPrice = useCallback(
    async (supply: string) => {
      if (!signingClient || !CONTRACT_ADDRESS) {
        throw new Error("Client not available or contract address not set");
      }

      try {
        const msg = {
          calculate_current_price: {
            supply: supply,
          },
        };

        const response = await signingClient.queryContractSmart(
          CONTRACT_ADDRESS,
          msg
        );
        return response;
      } catch (err) {
        console.error("Failed to calculate price:", err);
        throw err;
      }
    },
    [signingClient]
  );

  return {
    createMusicToken,
    purchaseTokens,
    getTokenData,
    calculateCurrentPrice,
    loading,
    error,
  };
}
