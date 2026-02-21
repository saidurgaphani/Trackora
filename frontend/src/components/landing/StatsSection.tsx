import { motion } from "framer-motion";

const stats = [
  { value: "10M+", label: "Monthly Active Learners" },
  { value: "200+", label: "Upskilling Courses" },
  { value: "500+", label: "Company Dashboards" },
  { value: "50K+", label: "Students Placed" },
];

const StatsSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="rounded-3xl bg-primary p-10 md:p-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl font-extrabold text-primary-foreground md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-primary-foreground/80">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
