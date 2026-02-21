import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = [
    {
        title: "Top 100 Codes",
        tag: "Popular",
        color: "bg-orange-50",
        tagColor: "bg-white text-orange-600",
        textColor: "text-orange-900",
    },
    {
        title: "Top 500 Codes",
        tag: "Advanced",
        color: "bg-blue-50",
        tagColor: "bg-white text-blue-600",
        textColor: "text-blue-900",
    },
    {
        title: "Learn C",
        tag: "Beginner",
        color: "bg-yellow-50/50",
        tagColor: "bg-white text-yellow-600",
        textColor: "text-yellow-900",
    },
    {
        title: "Learn C++",
        tag: "Beginner",
        color: "bg-purple-50",
        tagColor: "bg-white text-purple-600",
        textColor: "text-purple-900",
    },
    {
        title: "Learn DSA",
        tag: "Essential",
        color: "bg-red-50",
        tagColor: "bg-white text-red-600",
        textColor: "text-red-900",
    },
    {
        title: "Competitive Coding",
        tag: "Pro",
        color: "bg-emerald-50",
        tagColor: "bg-white text-emerald-600",
        textColor: "text-emerald-900",
    },
    {
        title: "Learn OS",
        tag: "CS Core",
        color: "bg-indigo-50",
        tagColor: "bg-white text-indigo-600",
        textColor: "text-indigo-900",
    },
    {
        title: "Learn DBMS",
        tag: "CS Core",
        color: "bg-amber-50",
        tagColor: "bg-white text-amber-600",
        textColor: "text-amber-900",
    },
];

const ProgrammingSection = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/login", { state: { from: "/student/courses" } });
    };

    return (
        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                    Programming & CS Subjects
                </h2>
                <p className="mt-3 text-muted-foreground">
                    Competitive Coding, Basic / Advanced Coding, Top Codes & CS Subjects
                </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((cat, i) => (
                    <motion.div
                        key={cat.title}
                        onClick={handleNavigation}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                        className={`group cursor-pointer rounded-2xl p-8 transition-all hover:scale-[1.02] ${cat.color} border border-transparent hover:border-border`}
                    >
                        <span
                            className={`inline-block rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${cat.tagColor}`}
                        >
                            {cat.tag}
                        </span>
                        <h3 className={`mt-4 text-xl font-bold ${cat.textColor}`}>
                            {cat.title}
                        </h3>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ProgrammingSection;
