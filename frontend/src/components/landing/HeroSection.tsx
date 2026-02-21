import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-students.png";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
            Trackora,{" "}
            <span className="text-gradient-primary">Placements</span>{" "}
            Simplified!!!
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            India's #1 platform for Aptitude, Coding, Interview Prep & Skill Courses.
            Trusted by 10 Million+ learners every month.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              onClick={() => navigate('/register')}
              size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Sign Up for Free
            </Button>
            <Button
              onClick={() => navigate('/login', { state: { from: '/student/courses' } })}
              size="lg" variant="outline" className="border-border text-foreground hover:bg-muted">
              Explore Courses
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-6">
            {["Aptitude", "Coding", "Interview Prep", "New Age Skills"].map((tag) => (
              <span
                key={tag}
                className="hidden rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground sm:inline-block"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <img
            src={heroImage}
            alt="Students celebrating placement success"
            className="w-full rounded-3xl"
          />
          {/* Floating card */}
          <div className="absolute -bottom-4 -left-4 rounded-2xl border border-border bg-card p-4 shadow-card md:-left-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-sm font-bold text-primary-foreground">✓</span>
              </div>
              <div>
                <p className="text-xs font-bold text-card-foreground">Got Placed!</p>
                <p className="text-xs text-muted-foreground">at Google</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
