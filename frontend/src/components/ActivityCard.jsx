import React from 'react';
import clsx from 'clsx';
import { Pencil, Trash2 } from 'lucide-react';
import Badge from './Badge';

export default function ActivityCard({ activity, onEdit, onDelete }) {
    const { category, subCategory, count, durationMinutes, source, loggedDate } = activity;

    return (
        <div className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-primary-500/5 hover:border-primary-500/30 dark:hover:border-primary-500/30 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden min-h-[160px] flex flex-col justify-between">
            <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/5 dark:group-hover:bg-primary-500/10 transition-colors duration-300 pointer-events-none" />
            <div className="absolute top-0 right-0 w-1 h-full bg-primary-500/30 group-hover:bg-primary-500 transition-colors duration-300" />

            <div className="relative z-10 flex-1">
                <div className="flex justify-between items-start mb-3">
                    <Badge variant="info" className="uppercase tracking-wider text-[10px]">{category}</Badge>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{new Date(loggedDate).toLocaleDateString()}</span>
                </div>

                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">{subCategory}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-4 truncate text-opacity-80">via {source}</p>

                <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                    <div className="flex gap-4">
                        <div className="p-2 bg-primary-50/50 dark:bg-primary-900/20 rounded-lg backdrop-blur-sm">
                            <span className="block text-xs text-slate-500 dark:text-slate-500">Problems</span>
                            <span className="block font-bold text-[var(--color-primary-500)]">{count}</span>
                        </div>
                        <div className="p-2 bg-primary-50/50 dark:bg-primary-900/20 rounded-lg backdrop-blur-sm">
                            <span className="block text-xs text-slate-500 dark:text-slate-500">Duration</span>
                            <span className="block font-bold text-amber-600">{durationMinutes}m</span>
                        </div>
                    </div>

                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={() => onEdit(activity)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors">
                            <Pencil size={18} />
                        </button>
                        <button onClick={() => onDelete(activity.id)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
