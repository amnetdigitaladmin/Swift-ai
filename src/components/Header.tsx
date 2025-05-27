
import { Code, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/6d2ee624-da66-4058-bda5-573daec3e844.png" 
                alt="Swift AI Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold">Swift AI</h1>
                <p className="text-indigo-100 text-sm">Expedite, Optimize, Realize</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 border-0">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 border-0">
              <Code className="h-4 w-4 mr-2" />
              API Keys
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
