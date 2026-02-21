import React, { useRef, useState } from 'react';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { Plus, Search, CheckCircle2, MoreVertical } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const mockGoals = [
    { id: '1', title: 'Solve 10 Array Problems', category: 'coding', target: 10, deadline: '2026-02-28', assigned: 'All CSE Students', completedPct: 45 },
    { id: '2', title: 'Quantitative Aptitude Prep', category: 'aptitude', target: 50, deadline: '2026-03-15', assigned: 'Third Year', completedPct: 12 },
    { id: '3', title: 'Group Discussion 1', category: 'softskills', target: 1, deadline: '2026-02-25', assigned: 'Section B', completedPct: 80 },
];

export default function ManageGoals() {
    const containerRef = useRef();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useGSAP(() => {
        gsap.from('.manage-anim', { y: -20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
    }, { scope: containerRef });

    const columns = [
        { header: 'Title', accessor: 'title', cellClassName: 'font-semibold text-slate-800 dark:text-slate-100 w-1/3' },
        { header: 'Category', render: (row) => <Badge variant="info" className="uppercase">{row.category}</Badge> },
        { header: 'Deadline', render: (row) => <span className="text-slate-500 dark:text-slate-500 font-medium">{row.deadline}</span> },
        { header: 'Assigned To', accessor: 'assigned' },
        {
            header: 'Progress', render: (row) => (
                <div className="w-full max-w-[120px] flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-primary-500)] rounded-full" style={{ width: `${row.completedPct}%` }}></div>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-500">{row.completedPct}%</span>
                </div>
            )
        },
        {
            header: 'Actions', render: () => (
                <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-[var(--color-primary-500)] rounded-full hover:bg-primary-50 transition-colors">
                    <MoreVertical size={18} />
                </button>
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
                        <input type="text" placeholder="Search goals..." className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] text-sm" />
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[var(--color-primary-500)] hover:bg-primary-800 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm whitespace-nowrap shadow-sm"
                    >
                        <Plus size={18} />
                        Create Goal
                    </button>
                </div>
            </div>

            <div className="manage-anim">
                <Table columns={columns} data={mockGoals} />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Goal">
                <div className="space-y-4">
                    {/* Admin Form UI */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Goal Title</label>
                        <input type="text" className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl" placeholder="E.g., Complete 50 LeetCode Mediums" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Category</label>
                            <select className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <option>Coding</option>
                                <option>Aptitude</option>
                                <option>Soft Skills</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Target Count</label>
                            <input type="number" className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl" placeholder="50" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Assign To</label>
                        <select className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl">
                            <option>All Students</option>
                            <option>CSE Department</option>
                            <option>Specific Batch</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Deadline</label>
                        <input type="date" className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl" />
                    </div>
                    <button className="w-full py-3 mt-4 bg-[var(--color-primary-500)] text-white font-semibold rounded-xl hover:bg-primary-800 transition-colors shadow-sm">
                        Publish Goal
                    </button>
                </div>
            </Modal>

        </div>
    );
}
