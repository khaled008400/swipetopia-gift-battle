
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/auth.types";
import { Wallet, Gift, ArrowRight } from "lucide-react";

interface WalletSectionProps {
  user: UserProfile;
}

const WalletSection = ({ user }: WalletSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-4 px-4">
      <div 
        className="bg-gradient-to-r from-app-yellow/20 to-app-gray-dark p-4 rounded-lg border border-app-yellow/30 mb-4"
        onClick={() => navigate("/wallet")}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Wallet className="h-5 w-5 text-app-yellow mr-2" />
            <span className="text-white font-semibold">My Wallet</span>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold mr-2">{user.coins}</span>
          <span className="text-app-yellow text-sm">coins</span>
        </div>
        <div className="mt-3 flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-transparent border-app-yellow text-app-yellow flex-1"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/wallet");
            }}
          >
            <Gift className="h-4 w-4 mr-1" />
            Buy Coins
          </Button>
          <Button 
            size="sm" 
            className="bg-app-yellow text-app-black hover:bg-app-yellow/80 flex-1"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/wallet?tab=history");
            }}
          >
            Transaction History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
