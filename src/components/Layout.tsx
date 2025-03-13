
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BottomNavigation from "./BottomNavigation";

const Layout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-app-black">
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
