import { useRef, useState, useCallback } from "react";

interface SwipeableRowProps {
  children: React.ReactNode;
  onAction: () => void;
  actionLabel?: string;
  actionColor?: string;
}

export function SwipeableRow({
  children,
  onAction,
  actionLabel = "Revogar",
  actionColor = "bg-red-500",
}: SwipeableRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const [offset, setOffset] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const THRESHOLD = 80;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = offset;
  }, [offset]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const diff = startXRef.current - e.touches[0].clientX;
    const newOffset = Math.max(0, Math.min(THRESHOLD, currentXRef.current + diff));
    setOffset(newOffset);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (offset > THRESHOLD / 2) {
      setOffset(THRESHOLD);
      setIsRevealed(true);
    } else {
      setOffset(0);
      setIsRevealed(false);
    }
  }, [offset]);

  const handleAction = useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => {
      onAction();
    }, 300);
  }, [onAction]);

  const handleClose = useCallback(() => {
    setOffset(0);
    setIsRevealed(false);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all ${
        isRemoving ? "max-h-0 opacity-0 mb-0" : "max-h-[200px] opacity-100"
      }`}
      style={{ transitionDuration: isRemoving ? "300ms" : "0ms" }}
    >
      {/* Action button behind */}
      <div
        className={`absolute inset-y-0 right-0 flex items-center ${actionColor}`}
        style={{ width: `${THRESHOLD}px` }}
      >
        <button
          onClick={handleAction}
          className="w-full h-full flex items-center justify-center text-white font-semibold text-[13px] active:opacity-80 transition-opacity"
        >
          {actionLabel}
        </button>
      </div>

      {/* Swipeable content */}
      <div
        ref={rowRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={isRevealed ? handleClose : undefined}
        className="relative bg-white transition-transform"
        style={{
          transform: `translateX(-${offset}px)`,
          transitionDuration: offset === 0 || offset === THRESHOLD ? "200ms" : "0ms",
          transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
