import React from "react";
import type { Stats } from "@/types/stats.ts";
import { pairsCount } from "@/types/consts.ts";

interface StatsWidgetProps {
  stats: Stats;
  hasWords: boolean;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  stats,
  hasWords,
}) => {
  const total = (stats.totalCount ?? 1) + pairsCount * 1.2;

  const percent =
    stats.turn > 0 ? Math.round((stats.correctCount / stats.turn) * 100) : 0;

  const progress = !hasWords ? 100 : Math.round((stats.turn / total) * 97);

  return (
    <div className="max-w-xl mx-auto ">
      <div className="p-4 bg-white rounded-lg text-center border gap-4">
        <h2 className="text-lg font-bold text-gray-800">📊 Статистика</h2>

        <div className="text-lg text-gray-600">
          Попыток: <span className="font-semibold">{stats.turn}</span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="text-lg text-gray-600">
          Правильных:{" "}
          <span className="font-semibold text-green-600">
            {stats.correctCount} / {percent}%
          </span>
        </div>
      </div>
    </div>
  );
};
