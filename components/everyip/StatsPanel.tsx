import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { MAX_IPv6 } from "@/lib/everyip/ip-utils";
import DynamicFacts from "@/lib/everyip/dynamic-facts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { generateFactPositions } from "@/lib/everyip/fact-utils";

interface StatsPanelProps {
  virtualPosition: BigNumber;
  onJump: (position: BigNumber) => void;
}

const jumpPositions = [
  { name: "Start", position: new BigNumber(0) },
  { name: "25%", position: MAX_IPv6.dividedBy(4).integerValue() },
  { name: "50%", position: MAX_IPv6.dividedBy(2).integerValue() },
  {
    name: "75%",
    position: MAX_IPv6.multipliedBy(3).dividedBy(4).integerValue(),
  },
  { name: "End", position: MAX_IPv6 },
];

const StatsPanel: React.FC<StatsPanelProps> = ({ virtualPosition, onJump }) => {
  const [isOpen, setIsOpen] = useState(false);
  const percentageComplete = virtualPosition
    .multipliedBy(100)
    .dividedBy(MAX_IPv6)
    .toFixed(10);
  const remainingAddresses = MAX_IPv6.minus(virtualPosition).toFixed();
  const factPositions = generateFactPositions();

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Progress: {percentageComplete}%
              </p>
              <p className="text-xs text-muted-foreground">
                Remaining: {remainingAddresses}
              </p>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="relative w-full mt-6 mb-8">
              <div className="mb-2 flex justify-between text-xs text-gray-500">
                {jumpPositions.map(({ name }) => (
                  <span key={name}>{name}</span>
                ))}
              </div>
              <Progress
                value={parseFloat(percentageComplete)}
                className="w-full h-3 rounded-lg"
              />
              <div className="mt-2 flex justify-between">
                {factPositions.map(({ percentage, position }) => {
                  const isClosest =
                    Math.abs(virtualPosition.minus(position).toNumber()) <
                    MAX_IPv6.dividedBy(100).toNumber();

                  return (
                    <button
                      key={percentage}
                      className={`w-1.5 h-1.5 rounded-full transition-all
                        ${
                          isClosest
                            ? "bg-blue-500 scale-150"
                            : "bg-gray-300 hover:bg-blue-500 hover:scale-150"
                        }`}
                      onClick={() => onJump(position)}
                      title={`Jump to ${percentage}%`}
                    />
                  );
                })}
              </div>
            </div>

            <DynamicFacts virtualPosition={virtualPosition} />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default StatsPanel;
