import React, { useRef } from 'react';
import ProgressChart from '../../components/ProgressChart';
import StatCard from '../../components/StatCard';
import { Flame, Star, Trophy, Target } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Progress() {
    const containerRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from('.header-elem', { y: -20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' })
            .from('.metric-card', { scale: 0.9, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' }, "-=0.3")
            .from('.chart-panel', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, "-=0.2");
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="header-elem text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Performance Analytics</h1>
                <p className="header-elem text-slate-500 dark:text-slate-500 mt-1">Detailed breakdown of your category-wise readiness.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                <div className="metric-card bg-gradient-to-br from-primary-50 to-primary-100/50 p-6 rounded-2xl border border-primary-200 relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-primary-200 opacity-30"><Flame size={120} /></div>
                    <div className="relative z-10 text-primary-600 mb-2"><Flame size={28} /></div>
                    <h3 className="relative z-10 text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">14 Days</h3>
                    <p className="relative z-10 text-sm text-slate-600 dark:text-slate-300 font-medium">Current Streak</p>
                </div>

                <div className="metric-card bg-gradient-to-br from-primary-50 to-primary-100/50 p-6 rounded-2xl border border-primary-200 relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-primary-200 opacity-30"><Trophy size={120} /></div>
                    <div className="relative z-10 text-primary-600 mb-2"><Trophy size={28} /></div>
                    <h3 className="relative z-10 text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">85%</h3>
                    <p className="relative z-10 text-sm text-slate-600 dark:text-slate-300 font-medium">Coding Score</p>
                </div>

                <div className="metric-card bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 rounded-2xl border border-amber-200 relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-amber-200 opacity-30"><Target size={120} /></div>
                    <div className="relative z-10 text-amber-600 mb-2"><Target size={28} /></div>
                    <h3 className="relative z-10 text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">60%</h3>
                    <p className="relative z-10 text-sm text-slate-600 dark:text-slate-300 font-medium">Aptitude Score</p>
                </div>

                <div className="metric-card bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl border border-emerald-200 relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-emerald-200 opacity-30"><Star size={120} /></div>
                    <div className="relative z-10 text-emerald-600 mb-2"><Star size={28} /></div>
                    <h3 className="relative z-10 text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">90%</h3>
                    <p className="relative z-10 text-sm text-slate-600 dark:text-slate-300 font-medium">Soft Skills Rating</p>
                </div>
            </div>

            <div className="chart-panel h-[500px]">
                <ProgressChart title="Monthly Category Growth" />
            </div>
        </div>
    );
}
