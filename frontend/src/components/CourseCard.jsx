import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CourseCard({
    title,
    description,
    author,
    authorAvatar,
    date,
    image,
}) {
    return (
        <div className="w-full mx-auto animate-item">
            <div className="relative overflow-hidden h-full flex flex-col rounded-2xl transition duration-200 group bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-t-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors z-10" />
                    <img
                        src={image}
                        alt="course thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                </div>
                <div className="p-6">
                    <h2 className="font-bold my-2 text-xl text-slate-800 dark:text-slate-100">
                        {title}
                    </h2>
                    <p className="font-normal my-4 text-sm text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                    <div className="flex flex-row justify-between items-center mt-6">
                        <span className="text-sm text-slate-500 dark:text-slate-500">{date}</span>
                        <Link
                            to={`/student/learning/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                            state={{ courseTitle: title }}
                            className="relative z-10 px-5 py-2.5 bg-primary-50 text-primary-500 dark:bg-primary-900/30 dark:text-primary-400 font-bold rounded-xl inline-flex items-center text-xs group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                            Start Learning <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
