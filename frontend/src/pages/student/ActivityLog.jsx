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
    const [editingActivity, setEditingActivity] = useState(null);

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
            gsap.fromTo('.header-element',
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
            );

            const cards = gsap.utils.toArray('.activity-item');
            if (cards.length > 0) {
                gsap.fromTo(cards,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.05,
                        ease: 'power3.out'
                    }
                );
            }
        }, containerRef);
        return () => ctx.revert();
    }, { scope: containerRef, dependencies: [activities] });

    const handleEdit = (activity) => {
        setEditingActivity(activity);
        setCategory(activity.category);
        setSubCategory(activity.subCategory);
        setCount(activity.count);
        setDurationMinutes(activity.durationMinutes);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this activity?")) return;
        const stringId = String(id);
        console.log("Deleting activity with ID:", stringId);
        try {
            await api.delete(`/activities/${stringId}`);
            setActivities(prev => prev.filter(a => String(a._id || a.id) !== stringId));
        } catch (error) {
            console.error("Failed to delete activity:", error);
            alert("Failed to delete activity. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                category: category.toLowerCase(),
                subCategory,
                count: Number(count),
                durationMinutes: Number(durationMinutes),
                source: editingActivity ? editingActivity.source : 'Manual Log'
            };

            if (editingActivity) {
                const id = String(editingActivity._id || editingActivity.id);
                console.log("Updating activity with ID:", id);
                const res = await api.put(`/activities/${id}`, payload);
                setActivities(prev => prev.map(a => String(a._id || a.id) === id ? res.data : a));
            } else {
                console.log("Creating new activity");
                const res = await api.post('/activities', payload);
                // Add new activity at the top
                setActivities(prev => [res.data, ...prev]);
            }

            setIsModalOpen(false);
            // Reset Form Defaults
            setEditingActivity(null);
            setSubCategory('');
            setCount('');
            setDurationMinutes('');
        } catch (error) {
            console.error("Failed to save activity", error);
            const errorMsg = error.response?.data?.message || error.message || "Unknown error occurred";
            alert(`Error saving activity: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openAddModal = () => {
        setEditingActivity(null);
        setCategory('coding');
        setSubCategory('');
        setCount('');
        setDurationMinutes('');
        setIsModalOpen(true);
    };

    return (
        <div ref={containerRef} className="max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="header-element text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Activity Log</h1>
                    <p className="header-element text-slate-500 dark:text-slate-400 mt-1">Record your daily preparation efforts.</p>
                </div>

                <div className="header-element flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Search size={16} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <input type="text" placeholder="Search logs..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] text-sm" />
                    </div>
                    <button
                        onClick={openAddModal}
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

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingActivity(null); }} title={editingActivity ? "Edit Activity" : "Log New Activity"}>
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
