import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
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
            href="#"
            className="text-[#FF99D1] hover:text-[#FF00FF] font-exo2"
          >
            FAQ
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
      >
        Start trading
      </Button>
    </header>
  );
}
