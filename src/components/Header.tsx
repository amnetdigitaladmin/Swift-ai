
import { Code, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { user } = useUser();

  return (
    <header className="bg-custom-nav_bg to-black text-white shadow-2xl border-b border-gray-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gradient-background-from to-gradient-background-to bg-clip-text text-transparent">Swift AI</h1>
              <p className="text-gray-300 text-sm">Expedite, Optimize, Realize</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="secondary" size="sm" className="bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 text-gray-200" asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <img 
              src="/lovable-uploads/6d2ee624-da66-4058-bda5-573daec3e844.png" 
              alt="Swift AI Logo" 
              className="h-24 w-auto"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
