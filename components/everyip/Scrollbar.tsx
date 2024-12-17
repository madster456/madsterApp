import React, { useCallback, useEffect, useRef, useState } from "react";
import BigNumber from "bignumber.js";

interface ScrollbarProps {
  maxPosition: BigNumber;
  virtualPosition: BigNumber;
  onScroll: (position: BigNumber) => void;
}

const THUMB_HEIGHT = 20;
const WHEEL_DELTA = 5;

const Scrollbar: React.FC<ScrollbarProps> = ({
  maxPosition,
  virtualPosition,
  onScroll,
}) => {
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate scroll percentage
  const scrollPercentage = maxPosition.isZero()
    ? 0
    : Number(virtualPosition.multipliedBy(100).dividedBy(maxPosition));

  // Calculate thumb position with proper constraints
  const thumbPosition = Math.min(
    100 - (THUMB_HEIGHT * 100) / (trackRef.current?.clientHeight || 100),
    Math.max(0, scrollPercentage)
  );

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === thumbRef.current || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const trackHeight = rect.height - THUMB_HEIGHT;
    const clickPosition = Math.max(
      0,
      Math.min(1, (e.clientY - rect.top - THUMB_HEIGHT / 2) / trackHeight)
    );

    const newPosition = maxPosition.multipliedBy(clickPosition).integerValue();
    onScroll(newPosition);
  };

  const handleDrag = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = rect.height - THUMB_HEIGHT;
      const percentage = Math.max(
        0,
        Math.min(1, (e.clientY - rect.top - THUMB_HEIGHT / 2) / trackHeight)
      );

      const newPosition = maxPosition.multipliedBy(percentage).integerValue();
      onScroll(newPosition);
    },
    [isDragging, maxPosition, onScroll]
  );

  const handleDragStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback(
    (e: Event) => {
      if (!(e instanceof WheelEvent)) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? WHEEL_DELTA : -WHEEL_DELTA;
      const newPosition = virtualPosition.plus(delta);

      if (
        newPosition.isGreaterThanOrEqualTo(0) &&
        newPosition.isLessThanOrEqualTo(maxPosition)
      ) {
        onScroll(newPosition);
      }
    },
    [virtualPosition, maxPosition, onScroll]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handleDrag);
      window.addEventListener("pointerup", handleDragEnd);
      return () => {
        window.removeEventListener("pointermove", handleDrag);
        window.removeEventListener("pointerup", handleDragEnd);
      };
    }
  }, [isDragging, handleDrag, handleDragEnd]);

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      track.addEventListener("wheel", handleWheel, { passive: false });
      return () => track.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  return (
    <div className="w-6 bg-slate-200 flex flex-col h-full">
      <div
        className="flex-1 cursor-pointer relative mx-0.5"
        ref={trackRef}
        onClick={handleTrackClick}
      >
        <div
          ref={thumbRef}
          className="absolute left-0 right-0 bg-slate-400 hover:bg-slate-500 cursor-grab active:cursor-grabbing transition-colors duration-150"
          style={{
            top: `${thumbPosition}%`,
            height: `${THUMB_HEIGHT}px`,
          }}
          onPointerDown={handleDragStart}
        />
      </div>
    </div>
  );
};

export default Scrollbar;
