import React, { useRef, useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ActivityCard from '../../components/ActivityCard';
import Modal from '../../components/Modal';

gsap.registerPlugin(ScrollTrigger);

const MOCK_ACTIVITIES = [
    { id: 1, category: 'coding', subCategory: 'Binary Search Trees', count: 3, durationMinutes: 90, source: 'LeetCode', loggedDate: new Date().toISOString() },
    { id: 2, category: 'aptitude', subCategory: 'Time & Work', count: 12, durationMinutes: 45, source: 'IndiaBix', loggedDate: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, category: 'softskills', subCategory: 'Group Discussion Prep', count: 1, durationMinutes: 60, source: 'Campus Connect', loggedDate: new Date(Date.now() - 172800000).toISOString() },
    { id: 4, category: 'coding', subCategory: 'Dynamic Programming', count: 2, durationMinutes: 120, source: 'CodeForces', loggedDate: new Date(Date.now() - 259200000).toISOString() },
    { id: 5, category: 'aptitude', subCategory: 'Percentages', count: 20, durationMinutes: 60, source: 'RS Aggarwal', loggedDate: new Date(Date.now() - 345600000).toISOString() },
];

export default function ActivityLog() {
    const containerRef = useRef();
    const [activities, setActivities] = useState(MOCK_ACTIVITIES);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useGSAP(() => {
        // Header animation
        gsap.from('.header-element', {
            y: -20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
        });

        // Cards scroll animation
        const cards = gsap.utils.toArray('.activity-item');
        cards.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom-=50',
                    toggleActions: 'play none none reverse'
                },
                y: 40,
                opacity: 0,
                duration: 0.5,
                ease: 'power3.out'
            });
        });
    }, { scope: containerRef, dependencies: [activities] });

    const handleEdit = (activity) => console.log('Edit', activity);
    const handleDelete = (id) => setActivities(activities.filter(a => a.id !== id));

    return (
        <div ref={containerRef} className="max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="header-element text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Activity Log</h1>
                    <p className="header-element text-slate-500 dark:text-slate-500 mt-1">Record your daily preparation efforts.</p>
                </div>

                <div className="header-element flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Search size={16} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <input type="text" placeholder="Search logs..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] text-sm" />
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2 bg-[var(--color-primary-500)] hover:bg-primary-800 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm whitespace-nowrap"
                    >
                        <PlusCircle size={18} />
                        Log Activity
                    </button>
                </div>
            </div>

            {/* Feed List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {activities.map(activity => (
                    <div key={activity.id} className="activity-item">
                        <ActivityCard activity={activity} onEdit={handleEdit} onDelete={handleDelete} />
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsOpen(false)} title="Log New Activity">
                {/* Form UI placeholder */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Category</label>
                        <select className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <option>Coding</option>
                            <option>Aptitude</option>
                            <option>Soft Skills</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Topic</label>
                        <input type="text" className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg" placeholder="e.g. Arrays, Time & Work" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Count/Units</label>
                            <input type="number" className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg" placeholder="10" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Duration (Mins)</label>
                            <input type="number" className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg" placeholder="60" />
                        </div>
                    </div>
                    <button className="w-full py-2.5 mt-4 bg-[var(--color-primary-500)] text-white font-medium rounded-lg hover:bg-primary-800 transition-colors">
                        Save Log Entry
                    </button>
                </div>
            </Modal>

        </div>
    );
}
