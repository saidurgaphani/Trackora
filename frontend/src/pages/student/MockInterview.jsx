import React, { useRef } from 'react';
import { CalendarRange, Info, UserCheck, Video } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Badge from '../../components/Badge';

export default function MockInterview() {
    const containerRef = useRef();

    useGSAP(() => {
        gsap.from('.fade-elem', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }, { scope: containerRef });

    const readinessScore = 78;
    const isEligible = readinessScore >= 75;

    return (
        <div ref={containerRef} className="max-w-4xl mx-auto space-y-8 py-4">
            <div className="text-center fade-elem space-y-4">
                <div className="mx-auto w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-[var(--color-primary-500)]">
                    <Video size={40} />
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Mock Interviews</h1>
                <p className="text-lg text-slate-500 dark:text-slate-500 max-w-2xl mx-auto">Validate your preparation with rigorous 1-on-1 mock interviews vetted by expert trainers.</p>
            </div>

            <div className="fade-elem bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden">
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-800 z-0"></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Eligibility Status</h3>
                            {isEligible ?
                                <Badge variant="success" className="px-3 py-1 text-sm">Eligible</Badge> :
                                <Badge variant="warning" className="px-3 py-1 text-sm">Not Eligible</Badge>
                            }
                        </div>

                        <div className="flex items-end gap-3 text-slate-800 dark:text-slate-100">
                            <span className="text-6xl font-black">{readinessScore}%</span>
                            <span className="text-lg font-medium text-slate-500 dark:text-slate-500 mb-2 whitespace-nowrap">Readiness Score</span>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {isEligible
                                ? "Great job! Your readiness score is above 75%. You are now eligible to schedule a mock interview with a trainer."
                                : "You need a minimum readiness score of 75% to schedule a mock interview. Keep working on your assigned goals!"
                            }
                        </p>
                    </div>

                    <div className="w-full md:w-auto p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
                        {isEligible ? (
                            <>
                                <CalendarRange size={40} className="text-[var(--color-primary-500)]" />
                                <h4 className="font-bold text-slate-800 dark:text-slate-100">Ready to proceed?</h4>
                                <button className="w-full bg-[var(--color-primary-500)] hover:bg-primary-800 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                    Request Schedule
                                </button>
                            </>
                        ) : (
                            <>
                                <UserCheck size={40} className="text-slate-300" />
                                <h4 className="font-bold text-slate-400 dark:text-slate-500">Unlock at 75%</h4>
                                <button disabled className="w-full bg-slate-200 text-slate-400 dark:text-slate-500 font-semibold py-3 px-6 rounded-xl cursor-not-allowed">
                                    Request Schedule
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>

            <div className="fade-elem bg-primary-50 p-6 rounded-2xl border border-primary-100 flex gap-4 mt-8">
                <div className="mt-1 text-primary-600"><Info size={24} /></div>
                <div>
                    <h4 className="font-bold text-primary-900 mb-1">How it works</h4>
                    <ul className="text-primary-800/80 space-y-2 text-sm list-disc pl-4">
                        <li>Requests are manually approved by trainers based on their availability.</li>
                        <li>You'll be evaluated heavily on Problem Solving, Communication, and Core Concepts.</li>
                        <li>Detailed feedback and a readiness score calibration will be provided afterward.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
