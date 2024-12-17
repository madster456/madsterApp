import React from "react";
import StatsPanel from "./StatsPanel";
import BigNumber from "bignumber.js";

interface AnimatedStatsPanelProps {
  virtualPosition: BigNumber;
  onJump: (position: BigNumber) => void;
  isVisible: boolean;
}

const AnimatedStatsPanel: React.FC<AnimatedStatsPanelProps> = ({
  virtualPosition,
  onJump,
  isVisible,
}) => {
  return (
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden
        ${isVisible ? "max-h-[500px] opacity-100 mb-4" : "max-h-0 opacity-0"}`}
    >
      <StatsPanel virtualPosition={virtualPosition} onJump={onJump} />
    </div>
  );
};

export default AnimatedStatsPanel;
