
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
              <img 
              src="/Swift-ai-logo.svg" 
              alt="Swift AI Logo" 
              className="h-6 w-24 object-contain"
              />
              <p className="text-gray-300 text-sm">Expedite, Optimize, Realize</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="secondary" size="sm" className="bg-custom-bg hover:bg-gray-700/80 border border-gray-600 text-gray-200" asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <img 
              src="/Swift-ai-logo.svg" 
              alt="Swift AI Logo" 
              className="h-24 w-24 object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
