import React from "react";
import BigNumber from "bignumber.js";
import { MAX_IPv6 } from "@/lib/everyip/ip-utils";

interface DynamicFactsProps {
  virtualPosition: BigNumber;
}

interface Fact {
  title: string;
  fact: string;
  description: string;
}

const facts: Fact[] = [
  {
    title: "The Largest IPv6 Address Space Remaining",
    fact: "You are at the very beginning of the IPv6 address space.",
    description:
      "The number represents the total number of IPv6 addresses available. At this point, you are starting from the very first address (::0) and have the full 128-bit address space to scroll through. It's like standing at the edge of an unimaginably vast digital universe.",
  },
  {
    title: "2% Complete - The Journey Begins",
    fact: "At 2%, you've explored approximately 6.8 quintillion IPv6 addresses.",
    description:
      "The position marks 2% progress through the vast IPv6 address space. This means you've scrolled through about 6.8 quintillion addresses, leaving a staggering 98% (over 333 quintillion) still to discover. You're only scratching the surface. So much more to explore..",
  },
  {
    title: "4% Complete - A Grain of Sand in the IPv6 Desert",
    fact: "You’ve explored about as many addresses as there are grains of sand on Earth’s beaches.",
    description:
      "With 96% IPv6 addresses remaining, you’ve scrolled through 4% of the space—roughly 13.6 quintillion addresses. To put that into perspective, scientists estimate there are about 7.5 quintillion grains of sand on all the world’s beaches. At 4%, you’ve already outpaced this count, yet there’s an ocean of IPv6 addresses still to go.",
  },
];

const DynamicFacts: React.FC<DynamicFactsProps> = ({ virtualPosition }) => {
  const dotPosition = Math.floor(
    virtualPosition.multipliedBy(50).dividedBy(MAX_IPv6).toNumber()
  );
  const currentFact = facts[dotPosition];

  if (!currentFact) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">{currentFact.title}</h3>
      <p className="text-sm">{currentFact.fact}</p>
      <p className="text-xs text-muted-foreground">{currentFact.description}</p>
    </div>
  );
};

export default DynamicFacts;
