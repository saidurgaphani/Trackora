import React, { useRef, useState, useEffect } from 'react';
import { PlusCircle, Search, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ActivityCard from '../../components/ActivityCard';
import Modal from '../../components/Modal';
import api from '../../api';

gsap.registerPlugin(ScrollTrigger);

export default function ActivityLog() {
    const containerRef = useRef();
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form States
    const [category, setCategory] = useState('coding');
    const [subCategory, setSubCategory] = useState('');
    const [count, setCount] = useState('');
    const [durationMinutes, setDurationMinutes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await api.get('/activities/me');
                setActivities(res.data);
            } catch (error) {
                console.error("Failed to fetch activities:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivities();
    }, []);

    useGSAP(() => {
        // cards scroll animation is handled when list populates.
        const ctx = gsap.context(() => {
            gsap.from('.header-element', {
                y: -20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
            });

            const cards = gsap.utils.toArray('.activity-item');
            if (cards.length > 0) {
                gsap.from(cards, {
                    y: 40,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power3.out'
                });
            }
        }, containerRef);
        return () => ctx.revert();
    }, { scope: containerRef, dependencies: [activities] });

    const handleEdit = (activity) => console.log('Edit', activity);
    const handleDelete = (id) => setActivities(activities.filter(a => (a._id || a.id) !== id));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.post('/activities', {
                category: category.toLowerCase(),
                subCategory,
                count: Number(count),
                durationMinutes: Number(durationMinutes),
                source: 'Manual Log'
            });
            // Add new activity at the top
            setActivities([res.data, ...activities]);
            setIsModalOpen(false);
            // Reset Form Defaults
            setSubCategory('');
            setCount('');
            setDurationMinutes('');
        } catch (error) {
            console.error("Failed to add activity", error);
            const errorMsg = error.response?.data?.message || error.message || "Unknown error occurred";
            alert(`Error saving activity: ${errorMsg}\n\nAllowed categories are: coding, aptitude, core, softskills.`);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[var(--color-primary-500)] hover:bg-primary-800 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm whitespace-nowrap cursor-pointer selection:bg-transparent"
                    >
                        <PlusCircle size={18} />
                        Log Activity
                    </button>
                </div>
            </div>

            {/* Feed List */}
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                    {activities.length === 0 && (
                        <div className="col-span-1 border border-dashed rounded-xl p-8 border-slate-300 dark:border-slate-800 flex justify-center w-full min-w-[500px]">
                            <p className="font-semibold text-slate-500">No activities found. Click 'Log Activity' to get started!</p>
                        </div>
                    )}
                    {activities.map((activity, index) => {
                        // Backend gives _id, frontend previous dummy gave id. Map it for safety.
                        const actId = activity._id || activity.id || index;
                        return (
                            <div key={actId} className="activity-item">
                                <ActivityCard activity={activity} onEdit={handleEdit} onDelete={handleDelete} />
                            </div>
                        )
                    })}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Activity">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="w-full p-2 border border-slate-200 bg-transparent dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-50"
                        >
                            <option value="coding">Coding</option>
                            <option value="aptitude">Aptitude</option>
                            <option value="core">Core Subjects</option>
                            <option value="softskills">Soft Skills</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Topic</label>
                        <input
                            type="text"
                            required
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                            className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-transparent dark:text-slate-50 rounded-lg"
                            placeholder="e.g. Arrays, Time & Work"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Count/Units</label>
                            <input
                                type="number"
                                required
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                                className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-transparent dark:text-slate-50 rounded-lg"
                                placeholder="10"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Duration (Mins)</label>
                            <input
                                type="number"
                                required
                                value={durationMinutes}
                                onChange={(e) => setDurationMinutes(e.target.value)}
                                className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-transparent dark:text-slate-50 rounded-lg"
                                placeholder="60"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center py-2.5 mt-4 bg-[var(--color-primary-500)] text-white font-medium rounded-lg hover:bg-primary-800 transition-colors cursor-pointer"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Log Entry"}
                    </button>
                </form>
            </Modal>

        </div>
    );
}
