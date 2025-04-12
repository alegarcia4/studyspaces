
import { Link } from "react-router-dom";
import { MapPin, Search, Star, Clock, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudySpotCard from "@/components/StudySpotCard";
import { studySpots } from "@/data/studySpots";
import Navbar from "@/components/Navbar";

const Index = () => {
  // Get top rated spots
  const featuredSpots = [...studySpots]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-studyspot-purple to-studyspot-light-purple text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Perfect Study Spot
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Discover student-recommended places to study, open when you need them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-studyspot-purple hover:bg-gray-100">
                <Link to="/spots">Find Study Spots</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/submit">Add a Spot</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why StudySpot?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <div className="mx-auto w-12 h-12 bg-studyspot-soft-purple rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-studyspot-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Nearby Spots</h3>
              <p className="text-gray-600">Discover study spaces near you, with details on distance and location.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <div className="mx-auto w-12 h-12 bg-studyspot-soft-purple rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-studyspot-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Late Night Options</h3>
              <p className="text-gray-600">Filter for places open late or 24/7 when you need to cram all night.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <div className="mx-auto w-12 h-12 bg-studyspot-soft-purple rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-studyspot-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Student Reviews</h3>
              <p className="text-gray-600">Read and leave reviews from fellow students who've studied there.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spots Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Top Rated Study Spots</h2>
            <Button asChild variant="link" className="text-studyspot-purple">
              <Link to="/spots">View All</Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {featuredSpots.map(spot => (
              <StudySpotCard key={spot.id} spot={spot} featured />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-studyspot-soft-purple py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 gradient-text">Know a Great Study Spot?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-700">
            Help other students by sharing your favorite study locations. It only takes a minute to add!
          </p>
          <Button asChild size="lg" className="bg-studyspot-purple hover:bg-studyspot-light-purple">
            <Link to="/submit">Add a Study Spot</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <MapPin className="h-6 w-6 text-studyspot-light-purple" />
              <span className="font-bold text-xl">StudySpot</span>
            </div>
            <div className="text-sm text-gray-400">
              Built with ❤️ for College Students | Hackathon Project 2025
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
