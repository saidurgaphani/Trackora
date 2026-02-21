import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import CompanyMarquee from "@/components/landing/CompanyMarquee";
import LearningPaths from "@/components/landing/LearningPaths";
import StatsSection from "@/components/landing/StatsSection";
import ProgrammingSection from "@/components/landing/ProgrammingSection";
import { AnimatedFeatureSpotlight } from "@/components/ui/feature-spotlight";
import { Eye } from "lucide-react";
import Footer from "@/components/landing/Footer";

import { ShootingStars } from "@/components/ui/shooting-stars";

const Index = () => {
  return (
    <div className="min-h-screen relative bg-background overflow-hidden text-foreground">
      {/* Background with stars that stays fixed while scrolling */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_80%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0)_80%)]" />
        <div className="landing-stars absolute inset-0 hidden dark:block" />

        <ShootingStars
          starColor="#9E00FF"
          trailColor="#2EB9DF"
          minSpeed={15}
          maxSpeed={35}
          minDelay={1000}
          maxDelay={3000}
          className="fixed"
        />
        <ShootingStars
          starColor="#FF0099"
          trailColor="#FFB800"
          minSpeed={10}
          maxSpeed={25}
          minDelay={2000}
          maxDelay={4000}
          className="fixed"
        />
        <ShootingStars
          starColor="#00FF9E"
          trailColor="#00B8FF"
          minSpeed={20}
          maxSpeed={40}
          minDelay={1500}
          maxDelay={3500}
          className="fixed"
        />
      </div>

      <style>{`
        .landing-stars {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: landing-twinkle 5s ease-in-out infinite;
          opacity: 0.5;
        }

        @keyframes landing-twinkle {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
      `}</style>

      {/* Actual Content Wrapper on top of the background */}
      <div className="relative z-10 w-full">
        <Navbar />
        <HeroSection />
        <CompanyMarquee />
        <LearningPaths />
        <ProgrammingSection />
        <div className="bg-muted py-20">
          <AnimatedFeatureSpotlight
            preheaderIcon={<Eye className="h-4 w-4" />}
            preheaderText="Master Your Coding Skills"
            heading={
              <>
                <span className="text-primary">Prep &</span> Practice
              </>
            }
            description="Practice topic-wise coding problems from top platforms to strengthen your core concepts. Improve your problem-solving skills and boost your placement readiness."
            buttonText="Start Practicing →"
            imageUrl="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1031&auto=format&fit=crop"
            imageAlt="Coding editor with algorithms"
          />
        </div>
        <StatsSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
