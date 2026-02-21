import React, { useRef, useState, useEffect } from 'react';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import { Search, SlidersHorizontal, Download, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function StudentsList() {
    const containerRef = useRef();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/students');
            setStudents(res.data);
        } catch (error) {
            console.error("Failed to fetch students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useGSAP(() => {
        if (!isLoading) {
            gsap.from('.std-anim', { y: -20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
        }
    }, [isLoading]);

    const columns = [
        {
            header: 'Student', render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary-500)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {row.name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{row.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 truncate font-mono">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Branch',
            render: (row) => <span>{row.profile?.branch || 'N/A'}</span>,
            cellClassName: 'font-medium text-slate-700 dark:text-slate-200'
        },
        {
            header: 'Score', render: (row) => (
                <div className={`font-mono font-bold ${row.score > 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {row.score || 0}%
                </div>
            )
        },
        {
            header: 'Status', render: (row) => {
                const status = row.isActive ? 'active' : 'inactive';
                return (
                    <Badge variant={status === 'active' ? 'success' : 'default'} className="capitalize">
                        {status}
                    </Badge>
                );
            }
        },
        {
            header: 'Joined',
            render: (row) => <span className="text-slate-500 dark:text-slate-500 text-sm">{new Date(row.createdAt).toLocaleDateString()}</span>
        },
        {
            header: 'Actions', render: (row) => (
                <button
                    onClick={() => navigate(`/admin/students/${row._id}`)}
                    className="px-3 py-1.5 text-sm font-semibold text-[var(--color-primary-500)] bg-primary-50 border border-primary-100 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
                >
                    View Profile
                </button>
            )
        }
    ];

    return (
        <div ref={containerRef} className="space-y-6 max-w-screen-2xl mx-auto">

            <div className="std-anim flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Student Directory</h1>
                    <p className="text-slate-500 dark:text-slate-500 mt-1">Manage and monitor all student activity profiles.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Search size={16} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <input type="text" placeholder="Search students..." className="w-full md:w-64 pl-9 pr-4 py-2 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] text-sm shadow-sm" />
                    </div>

                    <button className="p-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
                        <SlidersHorizontal size={20} />
                    </button>
                    <button className="p-2 border border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                </div>
            ) : (
                <div className="std-anim">
                    <Table columns={columns} data={students} />
                </div>
            )}

        </div>
    );
}
