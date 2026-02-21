import { Building2, BrainCircuit, Monitor, Code2, Users, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

const paths = [
  // {
  //   icon: Building2,
  //   title: "Companies",
  //   description: "Prepare for companies like Cisco, Amazon, TCS, Google and more",
  //   cta: "View All Companies",
  //   color: "bg-primary/10 text-primary",
  // },
  {
    icon: BrainCircuit,
    title: "Aptitude",
    description: "Learn Aptitude from basic to pro level with guided practice",
    cta: "Prepare Now",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Monitor,
    title: "CS Subjects",
    description: "Master CS subjects like OS, DBMS, CN and excel in interviews",
    cta: "Prepare Now",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: Code2,
    title: "Programming",
    description: "Learn C, C++, Java, Python and become a pro in coding",
    cta: "Get Started",
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: Users,
    title: "Mock Interview",
    description: "HR, Puzzles, Group Discussion, Interview Experiences and more",
    cta: "Get Started",
    color: "bg-rose-100 text-rose-700",
  },
  {
    icon: Megaphone,
    title: "Soft Skills",
    description: "Build strong communication and interview skills to stand out in placements",
    cta: "Explore",
    color: "bg-teal-100 text-teal-700",
  },
];

const LearningPaths = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Choose a Learning Path
        </h2>
        <p className="mt-3 text-muted-foreground">
          Pick your area and start preparing today
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((path, i) => (
          <motion.div
            key={path.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="group cursor-pointer rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
          >
            <div className={`mb-4 inline-flex rounded-xl p-3 ${path.color}`}>
              <path.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-card-foreground">{path.title}</h3>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              {path.description}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
              {path.cta} →
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LearningPaths;
