import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressChart from '../../components/ProgressChart';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import { ArrowLeft, Edit3, Mail, MapPin, Target } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function StudentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from('.sd-btn', { x: -20, opacity: 0, duration: 0.3 })
            .from('.sd-header', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' })
            .from('.sd-card', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, "-=0.2");
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="space-y-6 max-w-7xl mx-auto pb-10">

            <button
                onClick={() => navigate('/admin/students')}
                className="sd-btn flex items-center text-slate-500 dark:text-slate-500 hover:text-[var(--color-primary-500)] font-medium transition-colors"
            >
                <ArrowLeft size={18} className="mr-1" /> Back to Directory
            </button>

            {/* Header Profile */}
            <div className="sd-header bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="h-32 bg-[var(--color-primary-500)] relative">
                    <div className="absolute inset-0 bg-primary-900/20"></div>
                </div>
                <div className="px-8 pb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative">
                    <div className="flex items-end -mt-16 gap-6">
                        <div className="w-32 h-32 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-lg relative z-10">
                            <div className="w-full h-full rounded-xl bg-primary-100 flex items-center justify-center text-[var(--color-primary-500)] font-black text-4xl">
                                {/* Avatar Initials */}
                                A
                            </div>
                        </div>
                        <div className="pb-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Alice Smith</h1>
                                <Badge variant="success">Active</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-500 text-sm mt-2">
                                <span className="flex items-center gap-1"><Mail size={16} /> alice@snist.edu</span>
                                <span className="flex items-center gap-1"><MapPin size={16} /> Computer Science (3rd Yr)</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pb-2">
                        <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors">
                            Add Notes
                        </button>
                        <button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-xl hover:bg-primary-800 font-semibold shadow-sm transition-colors">
                            Assign Goal
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Readiness Score Panel */}
                <div className="sd-card bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-48 h-48 rounded-full border-8 border-slate-50 flex items-center justify-center relative mb-4">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="92" cy="92" r="88" className="text-slate-100 stroke-current" strokeWidth="8" fill="none" />
                            <circle cx="92" cy="92" r="88" className="text-[var(--color-primary-500)] stroke-current" strokeWidth="8" strokeDasharray="552" strokeDashoffset={552 - (552 * 0.94)} strokeLinecap="round" fill="none" />
                        </svg>
                        <div className="text-center">
                            <span className="text-4xl font-black text-slate-800 dark:text-slate-100">94%</span>
                            <p className="text-xs text-slate-500 dark:text-slate-500 font-semibold uppercase tracking-wider mt-1">Readiness</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
                        Highly Prepared for Placements
                    </p>
                </div>

                {/* Chart */}
                <div className="sd-card md:col-span-2 h-[320px]">
                    <ProgressChart title="Alice's Activity Trend" />
                </div>
            </div>

        </div>
    );
}
