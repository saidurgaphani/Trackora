import React, { useRef, useState, useEffect } from 'react';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { Plus, Search, CheckCircle2, MoreVertical, Loader2, Pencil, Trash2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../api';

export default function ManageGoals() {
    const containerRef = useRef();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('coding');
    const [targetCount, setTargetCount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/goals');
            setGoals(res.data);
        } catch (error) {
            console.error("Failed to fetch goals:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useGSAP(() => {
        if (!isLoading) {
            gsap.fromTo('.manage-anim',
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, [isLoading]);

    const handlePublish = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                title,
                category,
                targetCount: Number(targetCount),
                deadline: new Date(deadline),
                startDate: editingGoal ? editingGoal.startDate : new Date(),
                isActive
            };

            if (editingGoal) {
                const id = editingGoal._id || editingGoal.id;
                await api.put(`/admin/goals/${id}`, payload);
            } else {
                await api.post('/admin/goals', payload);
            }

            setIsModalOpen(false);
            // Reset form
            setEditingGoal(null);
            setTitle('');
            setCategory('coding');
            setTargetCount('');
            setDeadline('');
            setIsActive(true);
            // Refresh list
            fetchGoals();
        } catch (error) {
            console.error("Publish Error:", error);
            const errorMsg = error.response?.data?.message || error.message || "Unknown error";
            alert(`Failed to save goal: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (goal) => {
        setEditingGoal(goal);
        setTitle(goal.title);
        setCategory(goal.category);
        setTargetCount(goal.targetCount);
        setDeadline(new Date(goal.deadline).toISOString().split('T')[0]);
        if (goal.isActive !== undefined) setIsActive(goal.isActive);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this goal? This cannot be undone.")) return;
        try {
            await api.delete(`/admin/goals/${id}`);
            fetchGoals();
        } catch (error) {
            console.error("Delete Error:", error);
            alert("Failed to delete goal.");
        }
    };

    const columns = [
        { header: 'Title', accessor: 'title', cellClassName: 'font-semibold text-slate-800 dark:text-slate-100 w-1/3' },
        { header: 'Category', render: (row) => <Badge variant="info" className="uppercase">{row.category}</Badge> },
        {
            header: 'Deadline',
            render: (row) => (
                <span className="text-slate-500 dark:text-slate-500 font-medium">
                    {new Date(row.deadline).toLocaleDateString()}
                </span>
            )
        },
        { header: 'Target', accessor: 'targetCount' },
        {
            header: 'Status', render: (row) => (
                <Badge variant={row.isActive ? 'success' : 'default'}>
                    {row.isActive ? 'Active' : 'Draft'}
                </Badge>
            )
        },
        {
            header: 'Actions', render: (row) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => openEditModal(row)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-[var(--color-primary-500)] rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                        <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(row._id || row.id)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        },
    ];

    return (
        <div ref={containerRef} className="space-y-6 max-w-screen-2xl mx-auto">

            <div className="manage-anim flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Manage Goals</h1>
                    <p className="text-slate-500 dark:text-slate-500 mt-1">Assign targets to students, track massive completions.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Search size={16} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <input type="text" placeholder="Search goals..." className="w-full pl-9 pr-4 py-2 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] text-sm" />
                    </div>

                    <button
                        onClick={() => {
                            setEditingGoal(null);
                            setTitle('');
                            setCategory('coding');
                            setTargetCount('');
                            setDeadline('');
                            setIsActive(true);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-[var(--color-primary-500)] hover:bg-primary-800 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm whitespace-nowrap shadow-sm cursor-pointer"
                    >
                        <Plus size={18} />
                        Create Goal
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                </div>
            ) : (
                <div className="manage-anim">
                    <Table columns={columns} data={goals} />
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingGoal ? "Edit Goal" : "Create New Goal"}>
                <form onSubmit={handlePublish} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Goal Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl"
                            placeholder="E.g., Complete 50 LeetCode Mediums"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl"
                            >
                                <option value="coding">Coding</option>
                                <option value="aptitude">Aptitude</option>
                                <option value="core">Core Subjects</option>
                                <option value="softskills">Soft Skills</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Target Count</label>
                            <input
                                type="number"
                                required
                                value={targetCount}
                                onChange={(e) => setTargetCount(e.target.value)}
                                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl"
                                placeholder="50"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Deadline</label>
                        <input
                            type="date"
                            required
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl"
                        />
                    </div>
                    {editingGoal && (
                        <div className="flex items-center gap-2 mt-4 ml-1">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="w-4 h-4 text-primary-500 bg-slate-100 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                Active Goal
                            </label>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center py-3 mt-4 bg-[var(--color-primary-500)] text-white font-semibold rounded-xl hover:bg-primary-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingGoal ? "Update Goal" : "Publish Goal"}
                    </button>
                </form>
            </Modal>

        </div>
    );
}
