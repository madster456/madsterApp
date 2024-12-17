import BigNumber from "bignumber.js";
import { MAX_IPv6 } from "./ip-utils";

export const generateFactPositions = () => {
  const positions: Array<{
    position: BigNumber;
    percentage: number;
  }> = [];

  for (let i = 0; i <= 50; i++) {
    positions.push({
      position: MAX_IPv6.multipliedBy(i).dividedBy(50).integerValue(),
      percentage: (i * 100) / 50,
    });
  }

  return positions;
};