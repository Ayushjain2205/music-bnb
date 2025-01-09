"use client";

import { useEffect, useState } from "react";

interface Activity {
  id: string;
  type: "buy" | "sell";
  user: string;
  amount: number;
  price: number;
  timestamp: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Generate deterministic activity data based on songId
function generateActivityData(songId: string): Activity[] {
  const baseActivities: Activity[] = [
    {
      id: "1",
      type: "buy",
      user: "0x742...4c9",
      amount: 0.5,
      price: 0.25,
      timestamp: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      type: "sell",
      user: "0x123...def",
      amount: 0.3,
      price: 0.27,
      timestamp: "2024-01-15T09:45:00Z",
    },
    {
      id: "3",
      type: "buy",
      user: "0x456...789",
      amount: 0.8,
      price: 0.24,
      timestamp: "2024-01-15T09:30:00Z",
    },
  ];

  // Use songId to deterministically modify the data
  return baseActivities.map((activity) => ({
    ...activity,
    price: activity.price + Number(songId) * 0.01,
  }));
}

export function ActivityFeed({ songId }: { songId: string }) {
  // Use state with initialization function to ensure consistent data
  const [activities] = useState(() => generateActivityData(songId));
  const [mounted, setMounted] = useState(false);

  // Only render after component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-[#1A1522] border border-[#FF00FF]/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-[#00FFFF] font-audiowide mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1522] border border-[#FF00FF]/20 rounded-lg p-6">
      <h2 className="text-xl font-bold text-[#00FFFF] font-audiowide mb-4">
        Recent Activity
      </h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between py-2 border-b border-[#FF00FF]/10"
          >
            <div>
              <p className="text-[#FF99D1] font-exo2">
                {activity.type === "buy" ? "Bought" : "Sold"} by {activity.user}
              </p>
              <p className="text-sm text-zinc-400 font-exo2">
                {formatDate(activity.timestamp)}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`font-mono ${
                  activity.type === "buy" ? "text-[#00FFFF]" : "text-[#FF00FF]"
                }`}
              >
                {activity.amount.toFixed(3)} ETH
              </p>
              <p className="text-sm text-zinc-400 font-mono">
                ${activity.price.toFixed(3)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
