
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GiftAnimationProps {
  type: string;
  sender: string;
  amount: number;
  onComplete?: () => void;
}

// Mock gift animations based on type
const giftAnimations: Record<string, { icon: string; color: string; className: string }> = {
  "heart": {
    icon: "❤️",
    color: "bg-red-500",
    className: "animate-bounce"
  },
  "star": {
    icon: "⭐",
    color: "bg-yellow-500",
    className: "animate-spin"
  },
  "rocket": {
    icon: "🚀",
    color: "bg-blue-500",
    className: "animate-pulse"
  },
  "crown": {
    icon: "👑",
    color: "bg-purple-500",
    className: "animate-ping"
  },
  "diamond": {
    icon: "💎",
    color: "bg-cyan-500",
    className: "animate-bounce"
  }
};

const GiftAnimation = ({ type, sender, amount, onComplete }: GiftAnimationProps) => {
  const [visible, setVisible] = useState(true);
  
  // Get gift animation details, default to heart if type not found
  const giftAnimation = giftAnimations[type.toLowerCase()] || giftAnimations.heart;
  
  // Auto-hide the animation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 200, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -200, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center"
        >
          <div className={`px-4 py-2 rounded-full ${giftAnimation.color} bg-opacity-80 text-white text-sm backdrop-blur-sm mb-2`}>
            <span className="font-medium">{sender}</span> sent {amount} {type}!
          </div>
          
          <div className={`text-6xl ${giftAnimation.className}`} style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.5))" }}>
            {giftAnimation.icon}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GiftAnimation;
