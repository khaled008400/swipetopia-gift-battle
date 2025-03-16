
import React from 'react';

export const Loader = ({ size = "medium", className = "" }: { size?: "small" | "medium" | "large", className?: string }) => {
  const getSizeClasses = () => {
    switch(size) {
      case "small":
        return "h-4 w-4";
      case "large":
        return "h-12 w-12";
      case "medium":
      default:
        return "h-8 w-8";
    }
  };

  return (
    <div className={`animate-spin rounded-full border-t-2 border-primary ${getSizeClasses()} ${className}`} />
  );
};

export default Loader;
