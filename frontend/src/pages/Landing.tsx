import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import CompanyMarquee from "@/components/landing/CompanyMarquee";
import LearningPaths from "@/components/landing/LearningPaths";
import StatsSection from "@/components/landing/StatsSection";
import ProgrammingSection from "@/components/landing/ProgrammingSection";
import { AnimatedFeatureSpotlight } from "@/components/ui/feature-spotlight";
import { Eye } from "lucide-react";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
  );
};

export default Index;
