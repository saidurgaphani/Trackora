import React, { useRef, useState, useEffect } from 'react';
import StatCard from '../../components/StatCard';
import ProgressChart from '../../components/ProgressChart';
import { Users, Activity, CheckCircle, Target, Plus, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import AddAdminModal from '../../components/AddAdminModal';
import api from '../../api';

export default function AdminDashboard() {
    const containerRef = useRef();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeFrame, setTimeFrame] = useState('weekly');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                let url = `/admin/analytics?timeFrame=${timeFrame}`;
                if (timeFrame === 'custom') {
                    if (customStart) url += `&startDate=${customStart}`;
                    if (customEnd) url += `&endDate=${customEnd}`;
                }
                const res = await api.get(url);
                setAnalytics(res.data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, [timeFrame, customStart, customEnd]);

    useGSAP(() => {
        if (isLoading) return;
        const tl = gsap.timeline();
        tl.from('.admin-hdr', { y: -20, opacity: 0, duration: 0.5, ease: 'power2.out' })
            .from('.admin-stat', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' }, "-=0.2")
            .from('.admin-widget', { scale: 0.95, opacity: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out' }, "-=0.2");
    }, { scope: containerRef, dependencies: [isLoading] });

    if (isLoading) return <div className="flex justify-center mt-20"><Loader2 className="w-10 h-10 animate-spin text-primary-500" /></div>;

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
                        Last updated: Just Now
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="admin-stat">
                    <StatCard title="Total Students" value={analytics?.totalStudents || 0} icon={<Users size={24} />} className="border-l-4 border-l-blue-500" />
                </div>
                <div className="admin-stat">
                    <StatCard title="Total Activity Records" value={analytics?.totalActivitiesRecorded || 0} icon={<Activity size={24} />} className="border-l-4 border-l-emerald-500" />
                </div>
                <div className="admin-stat">
                    <StatCard title="Avg Activity Per Student" value={analytics?.averageActivitiesPerStudent || 0} icon={<Target size={24} />} className="border-l-4 border-l-amber-500" />
                </div>
                <div className="admin-stat">
                    <StatCard title="Inactive Students" value={analytics?.inactiveStudents || 0} icon={<CheckCircle size={24} />} className="border-l-4 border-l-purple-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="admin-widget xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm min-h-[400px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Platform Engagement</h3>
                        <div className="flex flex-wrap items-center gap-3">
                            {timeFrame === 'custom' && (
                                <div className="flex items-center gap-2">
                                    <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[var(--color-primary-500)] py-1.5 px-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                                    <span className="text-slate-500">-</span>
                                    <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[var(--color-primary-500)] py-1.5 px-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                                </div>
                            )}
                            <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[var(--color-primary-500)] py-2 px-3 dark:bg-slate-800 dark:border-slate-700 dark:text-white font-medium cursor-pointer outline-none transition-all">
                                <option value="weekly">Last 7 Days</option>
                                <option value="monthly">Last 30 Days</option>
                                <option value="yearly">Last 12 Months</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>
                    </div>
                    <div className="h-[320px]">
                        <ProgressChart data={analytics?.barChartData} type="bar" title=" " />
                    </div>
                </div>

                <div className="admin-widget bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Top Performers</h3>
                        <button className="text-sm text-[var(--color-primary-500)] font-semibold hover:underline">View All</button>
                    </div>
                    <div className="flex-1 overflow-auto divide-y divide-slate-50">
                        {(!analytics?.topPerformers || analytics.topPerformers.length === 0) ? (
                            <div className="p-10 text-center text-slate-500 text-sm">No activity recorded yet.</div>
                        ) : (
                            analytics.topPerformers.map((student, i) => (
                                <div key={student._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                    <div className="font-black text-slate-200 dark:text-slate-800 w-6 text-center">{i + 1}</div>
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary-500)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
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
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
