import React, { useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, FileText, CheckCircle2, Lock } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Learning() {
    const { courseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const containerRef = useRef();

    // Check if title passed through router state, otherwise generate from URL param
    const title = location.state?.courseTitle || (courseId ? courseId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Course Overview');

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from('.learning-header', { y: -20, opacity: 0, duration: 0.5, ease: 'power3.out' })
            .from('.video-player', { scale: 0.95, opacity: 0, duration: 0.6, ease: 'power2.out' }, "-=0.3")
            .from('.module-item', { x: 20, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, "-=0.4");
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="max-w-7xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Courses
            </button>

            <div className="learning-header">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Currently playing: Introduction to the Course</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Fake Video Player */}
                    <div className="video-player w-full aspect-video bg-slate-900 rounded-3xl overflow-hidden relative shadow-lg flex items-center justify-center group cursor-pointer border border-slate-800">
                        <div className="absolute inset-0 bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors" />
                        <PlayCircle className="w-20 h-20 text-white/50 group-hover:text-white/80 transition-colors relative z-10" />
                        <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
                            <span className="text-sm font-semibold text-white/90 drop-shadow-md">Session 1. Introduction</span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
                            <div className="h-1.5 bg-white/20 w-full rounded-full overflow-hidden mr-4">
                                <div className="h-full bg-primary-500 w-1/3"></div>
                            </div>
                            <span className="text-xs text-white/80 font-medium whitespace-nowrap">12:45 / 35:20</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">About this module</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                            This module gives you a comprehensive understanding of the core concepts related to {title}. We will begin by discussing the foundational theories and gradually move on to practical implementation details. Fasten your seatbelt as we dive deep into the first lesson. Ensure you complete the practice exercises at the end of this module.
                        </p>
                    </div>
                </div>

                {/* Course Syllabus/Modules Sidebar */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col h-[550px] overflow-hidden shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">Course Content</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        <div className="module-item p-4 rounded-2xl border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/10 cursor-pointer">
                            <div className="flex items-center gap-4">
                                <PlayCircle className="w-6 h-6 text-primary-500" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50">1. Introduction</h4>
                                    <p className="text-xs text-slate-500 mt-1">35 mins</p>
                                </div>
                            </div>
                        </div>

                        <div className="module-item p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors">
                            <div className="flex items-center gap-4">
                                <FileText className="w-6 h-6 text-slate-400" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">2. Core Principles Reading</h4>
                                    <p className="text-xs text-slate-500 mt-1">15 mins</p>
                                </div>
                            </div>
                        </div>

                        <div className="module-item p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed opacity-60">
                            <div className="flex items-center gap-4">
                                <Lock className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">3. Advanced Techniques</h4>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">45 mins</p>
                                </div>
                            </div>
                        </div>

                        <div className="module-item p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed opacity-60">
                            <div className="flex items-center gap-4">
                                <Lock className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">4. Practice Exercise</h4>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">60 mins</p>
                                </div>
                            </div>
                        </div>

                        <div className="module-item p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed opacity-60">
                            <div className="flex items-center gap-4">
                                <Lock className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">5. Final Assessment</h4>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">90 mins</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
