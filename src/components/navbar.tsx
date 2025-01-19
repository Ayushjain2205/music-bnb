"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { Loader2 } from "lucide-react";
import { Abstraxion, useModal } from "@burnt-labs/abstraxion";

export function Navbar() {
  const { account, loading } = useWallet();
  const [, setShow] = useModal();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="flex items-center justify-between p-6">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-2xl font-bold retro-wave-text"
          style={{
            fontFamily: "var(--font-press-start-2p)",
            letterSpacing: "0.1em",
          }}
        >
          TUNECRAFT
        </Link>
        <nav className="space-x-6">
          <Link
            href="/create"
            className="text-[#FF99D1] hover:text-[#FF00FF] font-exo2"
          >
            Create
          </Link>
          <Link
            href="#"
            className="text-[#FF99D1] hover:text-[#FF00FF] font-exo2"
          >
            Twitter/X
          </Link>
        </nav>
      </div>
      <Button
        className="bg-[#FF00FF] text-white hover:bg-[#FF66B8] font-exo2"
        size="lg"
        onClick={() => setShow(true)}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : account ? (
          formatAddress(account)
        ) : (
          "Connect Wallet"
        )}
      </Button>
      <Abstraxion onClose={() => setShow(false)} />
    </header>
  );
}
