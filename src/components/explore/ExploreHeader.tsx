
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExploreHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="px-4 py-3 flex items-center bg-app-gray-dark">
      <button 
        onClick={() => navigate(-1)}
        className="mr-4"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </button>
      <h1 className="text-lg font-semibold text-white">Explore</h1>
    </div>
  );
};

export default ExploreHeader;
