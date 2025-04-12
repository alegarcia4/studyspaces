
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-studyspot-purple" />
            <span className="font-bold text-xl text-studyspot-midnight">StudySpot</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-studyspot-midnight hover:text-studyspot-purple transition-colors">
              Home
            </Link>
            <Link to="/spots" className="text-studyspot-midnight hover:text-studyspot-purple transition-colors">
              Find Spots
            </Link>
            <Link to="/submit" className="text-studyspot-midnight hover:text-studyspot-purple transition-colors">
              Add a Spot
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="default" className="bg-studyspot-purple hover:bg-studyspot-light-purple">
              Sign In
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="px-4 py-2 text-studyspot-midnight hover:bg-studyspot-soft-purple rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/spots" 
                className="px-4 py-2 text-studyspot-midnight hover:bg-studyspot-soft-purple rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Spots
              </Link>
              <Link 
                to="/submit" 
                className="px-4 py-2 text-studyspot-midnight hover:bg-studyspot-soft-purple rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Add a Spot
              </Link>
              <div className="pt-2 border-t border-gray-100 mt-2">
                <Button variant="default" className="w-full bg-studyspot-purple hover:bg-studyspot-light-purple">
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
