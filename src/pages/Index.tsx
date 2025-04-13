// src/pages/Index.tsx
import { Link } from "react-router-dom";
import { MapPin, Search, Star, Clock, Coffee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudySpotCard from "@/components/StudySpotCard";
import { studySpots } from "@/data/studySpots";
import Navbar from "@/components/Navbar";

const Index = () => {
  // Get top rated spaces
  const featuredSpots = [...studySpots]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-space-dark via-indigo-950 to-space-medium text-space-text py-24 md:py-32">
         {/* Subtle background pattern (optional) */}
         <div className="absolute inset-0 opacity-5 bg-[url('/path/to/star-pattern.svg')] bg-repeat"></div>
         <div className="container mx-auto px-4 relative z-10">
           <div className="max-w-3xl mx-auto text-center">
             <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
               Find Your Perfect <span className="gradient-text">Study Space</span>
             </h1>
             <p className="text-lg md:text-xl mb-10 text-space-subtle-text max-w-xl mx-auto">
               Discover and share the best student-recommended places to focus and learn near campus.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base">
                 <Link to="/spots">
                     Find Spaces <ArrowRight className="ml-2 h-4 w-4"/>
                 </Link>
               </Button>
               <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary px-8 py-3 text-base">
                 <Link to="/submit">Add a Space</Link>
               </Button>
             </div>
           </div>
         </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/30 border-t border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-foreground">Why StudySpace?</h2>

           <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                 <MapPin className="h-7 w-7" />
               </div>
               <h3 className="text-xl font-semibold mb-3 text-foreground">Find Nearby Spaces</h3>
               <p className="text-muted-foreground text-sm">Quickly locate study spots around campus with details on distance and amenities.</p>
             </div>

             <div className="flex flex-col items-center text-center">
               <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                 <Clock className="h-7 w-7" />
               </div>
               <h3 className="text-xl font-semibold mb-3 text-foreground">Hours & Availability</h3>
               <p className="text-muted-foreground text-sm">Filter for spots open late or 24/7, perfect for those all-nighters.</p>
             </div>

             <div className="flex flex-col items-center text-center">
               <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                 <Star className="h-7 w-7" />
               </div>
               <h3 className="text-xl font-semibold mb-3 text-foreground">Student Reviews</h3>
               <p className="text-muted-foreground text-sm">Read honest feedback from fellow students to find the best vibe for you.</p>
             </div>
           </div>
        </div>
      </section>

      {/* Featured Spaces Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Top Rated Spaces</h2>
            <Button asChild variant="link" className="text-primary text-sm">
              <Link to="/spots">View All Spots <ArrowRight className="ml-1 h-4 w-4"/></Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {featuredSpots.map(spot => (
              <StudySpotCard key={spot.id} spot={spot} featured />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold mb-6 text-foreground">Know a Great Study Space?</h2>
           <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
             Help fellow students by sharing your favorite study locations. Add details like amenities, hours, and photos!
           </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base">
            <Link to="/submit">Add Your Spot</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">StudySpace</span>
            </div>
            <div className="text-xs text-muted-foreground text-center md:text-right">
               © {new Date().getFullYear()} StudySpace | A Demo Project
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;