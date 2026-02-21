import React, { useRef, useState } from 'react';
import StatCard from '../../components/StatCard';
import ProgressChart from '../../components/ProgressChart';
import { Users, Activity, CheckCircle, Target, Plus } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import AddAdminModal from '../../components/AddAdminModal';

export default function AdminDashboard() {
    const containerRef = useRef();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from('.admin-hdr', { y: -20, opacity: 0, duration: 0.5, ease: 'power2.out' })
            .from('.admin-stat', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' }, "-=0.2")
            .from('.admin-widget', { scale: 0.95, opacity: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out' }, "-=0.2");
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="space-y-6 max-w-screen-2xl mx-auto">

            {/* Add Admin/Trainer Modal */}
            <AddAdminModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <div className="admin-hdr flex justify-between items-end pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">College Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-500 mt-1">SNIST Placement Analytics</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Add User
                    </button>
                    <div className="hidden sm:block text-sm font-semibold text-[var(--color-primary-500)] bg-primary-50 px-3 py-2 rounded-xl border border-primary-100">
                        Last updated: Today
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="admin-stat"><StatCard title="Total Students" value="1,248" trend={4} trendLabel="this semester" icon={<Users size={24} />} className="border-l-4 border-l-blue-500" /></div>
                <div className="admin-stat"><StatCard title="Active Participants" value="984" trend={12} icon={<Activity size={24} />} className="border-l-4 border-l-emerald-500" /></div>
                <div className="admin-stat"><StatCard title="Avg Readiness" value="68%" trend={-1} icon={<Target size={24} />} className="border-l-4 border-l-amber-500" /></div>
                <div className="admin-stat"><StatCard title="Mock Interviews" value="156" trend={24} icon={<CheckCircle size={24} />} className="border-l-4 border-l-purple-500" /></div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="admin-widget xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm min-h-[400px]">
                    <ProgressChart title="Platform Engagement (Monthly)" />
                </div>

                <div className="admin-widget bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Top Performers</h3>
                        <button className="text-sm text-[var(--color-primary-500)] font-semibold hover:underline">View All</button>
                    </div>
                    <div className="flex-1 overflow-auto divide-y divide-slate-50">
                        {[
                            { id: 1, name: 'Alice Smith', score: 94, branch: 'CSE' },
                            { id: 2, name: 'Bob Johnson', score: 91, branch: 'IT' },
                            { id: 3, name: 'Charlie Davis', score: 88, branch: 'ECE' },
                            { id: 4, name: 'Diana King', score: 85, branch: 'CSE' },
                            { id: 5, name: 'Ethan Hunt', score: 82, branch: 'EEE' },
                        ].map((student, i) => (
                            <div key={student.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                <div className="font-black text-slate-300 w-6 text-center">{i + 1}</div>
                                <div className="w-10 h-10 rounded-full bg-[var(--color-secondary-900)] text-white flex items-center justify-center font-bold text-sm">
                                    {student.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{student.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{student.branch}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-bold text-emerald-600">{student.score}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
