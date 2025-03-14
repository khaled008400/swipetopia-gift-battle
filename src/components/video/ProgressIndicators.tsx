
interface ProgressIndicatorsProps {
  totalVideos: number;
  activeIndex: number;
}

const ProgressIndicators = ({ totalVideos, activeIndex }: ProgressIndicatorsProps) => {
  return (
    <div className="absolute top-4 left-0 right-0 z-20 flex justify-center gap-1">
      {Array.from({ length: totalVideos }).map((_, index) => (
        <div 
          key={index}
          className={`h-1 rounded-full ${
            index === activeIndex ? "bg-white w-6" : "bg-white/30 w-4"
          } transition-all duration-200`}
        />
      ))}
    </div>
  );
};

export default ProgressIndicators;
