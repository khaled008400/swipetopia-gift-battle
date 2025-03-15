
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from 'lucide-react';

export interface GiftAnimationProps {
  streamId: string;
  type?: string;
  sender?: string;
  amount?: number;
  onComplete?: () => void;
}

const GiftAnimation: React.FC<GiftAnimationProps> = ({ 
  streamId,
  type = "heart",
  sender = "Anonymous",
  amount = 10,
  onComplete
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 300); // Wait for exit animation to complete
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Map gift types to animations and colors
  const giftConfig: Record<string, { icon: string; color: string }> = {
    heart: { icon: "❤️", color: "rgb(239, 68, 68)" },
    star: { icon: "⭐", color: "rgb(234, 179, 8)" },
    rocket: { icon: "🚀", color: "rgb(59, 130, 246)" },
    crown: { icon: "👑", color: "rgb(168, 85, 247)" },
    diamond: { icon: "💎", color: "rgb(20, 184, 166)" }
  };

  // Use fallback if gift type doesn't exist
  const { icon, color } = giftConfig[type] || giftConfig.heart;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute bottom-24 left-0 right-0 flex justify-center items-center z-50 pointer-events-none"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
        >
          <div className="bg-black/70 backdrop-blur-md rounded-lg px-5 py-3 text-white flex items-center">
            <span className="text-3xl mr-3">{icon}</span>
            <div>
              <p className="font-bold">{sender} <span className="font-normal">sent a gift!</span></p>
              <div className="flex items-center">
                <Gift className="h-3 w-3 text-yellow-400 mr-1" />
                <span className="text-sm text-yellow-400">+{amount} coins</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GiftAnimation;
