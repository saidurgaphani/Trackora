import React, { useRef } from 'react';
import { BookOpen, Code, Terminal, Youtube, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Resources = () => {
    const containerRef = useRef();

    useGSAP(() => {
        // Use fromTo to strictly guarantee final visibility state
        gsap.fromTo('.page-header',
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
        gsap.fromTo('.resource-card',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.1 }
        );
    }, { scope: containerRef });

    const resourceGroups = [
        {
            title: "Data Structures & Algos",
            icon: <Code size={24} />,
            colorTheme: "text-indigo-600 dark:text-indigo-400",
            bgTheme: "bg-indigo-50 dark:bg-indigo-900/20 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40",
            glowTheme: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
            links: [
                { text: "LeetCode Top Interview 150", url: "https://leetcode.com/studyplan/top-interview-150/" },
                { text: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" },
                { text: "HackerRank Problem Solving", url: "https://www.hackerrank.com/domains/algorithms" }
            ]
        },
        {
            title: "System Design",
            icon: <Terminal size={24} />,
            colorTheme: "text-orange-600 dark:text-orange-400",
            bgTheme: "bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40",
            glowTheme: "bg-orange-500/10 group-hover:bg-orange-500/20",
            links: [
                { text: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
                { text: "Grokking the System Design", url: "https://www.designgurus.io/course/grokking-the-system-design-interview" },
                { text: "ByteByteGo YouTube Channel", url: "https://www.youtube.com/@ByteByteGo" }
            ]
        },
        {
            title: "Aptitude Tutorials",
            icon: <BookOpen size={24} />,
            colorTheme: "text-emerald-600 dark:text-emerald-400",
            bgTheme: "bg-emerald-50 dark:bg-emerald-900/20 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40",
            glowTheme: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
            links: [
                { text: "IndiaBix Quantitative", url: "https://www.indiabix.com/aptitude/questions-and-answers/" },
                { text: "CareerRide Reasoning", url: "https://www.careerride.com/Reasoning-Questions.aspx" },
                { text: "GeeksForGeeks Aptitude", url: "https://www.geeksforgeeks.org/placements-gq/" }
            ]
        },
        {
            title: "Soft Skills & Interviews",
            icon: <Youtube size={24} />,
            colorTheme: "text-pink-600 dark:text-pink-400",
            bgTheme: "bg-pink-50 dark:bg-pink-900/20 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/40",
            glowTheme: "bg-pink-500/10 group-hover:bg-pink-500/20",
            links: [
                { text: "STAR Method Guide", url: "https://www.themuse.com/advice/star-interview-method" },
                { text: "Mock Interview platforms (Pramp)", url: "https://www.pramp.com/#/" },
                { text: "Resume Best Practices", url: "https://www.careercup.com/resume" }
            ]
        }
    ];

    return (
        <div ref={containerRef} className="max-w-7xl mx-auto space-y-8">
            <div className="page-header opacity-0">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Placement Resources</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
                    Curated links and guides to help you master every stage of the software engineering recruitment process.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {resourceGroups.map((group, idx) => (
                    <div key={idx} className={`resource-card opacity-0 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col group hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all duration-300 transform hover:-translate-y-1`}>
                        <div className={`p-6 flex items-center gap-4 relative overflow-hidden transition-colors ${group.bgTheme}`}>
                            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl transition-colors ${group.glowTheme}`}></div>
                            <div className={`w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm relative z-10 group-hover:scale-110 transition-transform duration-300 ${group.colorTheme}`}>
                                {group.icon}
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 relative z-10">{group.title}</h2>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <ul className="space-y-4">
                                {group.links.map((link, lidx) => (
                                    <li key={lidx}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`group/link flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:${group.colorTheme.split(' ')[0]} dark:hover:${group.colorTheme.split(' ')[1]}`}
                                        >
                                            <span className="flex-1 drop-shadow-sm group-hover/link:text-inherit">{link.text}</span>
                                            <ArrowRight size={14} className={`opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all ${group.colorTheme}`} />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Resources;
