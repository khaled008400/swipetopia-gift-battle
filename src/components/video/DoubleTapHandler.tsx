
import { useState } from "react";

interface DoubleTapHandlerProps {
  showHeart: boolean;
  tapPosition: { x: number, y: number };
}

const DoubleTapHandler = ({ showHeart, tapPosition }: DoubleTapHandlerProps) => {
  if (!showHeart) return null;
  
  return (
    <div 
      className="absolute z-20 animate-scale-in" 
      style={{ 
        top: tapPosition.y - 40, 
        left: tapPosition.x - 40,
        animation: "scale-in 0.5s ease-out forwards, fade-out 0.5s ease-out 0.3s forwards" 
      }}
    >
      <div className="text-red-500 opacity-80">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </div>
    </div>
  );
};

export default DoubleTapHandler;
