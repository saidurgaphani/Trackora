import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import Badge from './Badge';

export default function GoalCard({ title, category, target, current, deadline, status }) {
    const isCompleted = status === 'completed';
    const progressPercent = Math.min((current / target) * 100, 100);

    return (
        <div className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-md bg-white dark:bg-slate-900 ${isCompleted ? 'border-emerald-200' : 'border-slate-200 dark:border-slate-700'}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2 items-center">
                    <Badge variant={isCompleted ? 'success' : 'info'} className="capitalize">
                        {category}
                    </Badge>
                    {isCompleted && <span className="text-emerald-500"><CheckCircle2 size={18} /></span>}
                </div>
                <Badge variant={isCompleted ? 'success' : (progressPercent > 80 ? 'warning' : 'default')}>
                    {isCompleted ? 'Completed' : 'Active'}
                </Badge>
            </div>

            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4 line-clamp-2">{title}</h4>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-500 dark:text-slate-500">Progress</span>
                    <span className="text-slate-800 dark:text-slate-100">{current} / {target}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ease-out rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-[var(--color-primary-500)]'}`}
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex items-center text-xs text-slate-500 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Clock size={14} className="mr-1" />
                Due: <span className="ml-1 font-medium text-slate-700 dark:text-slate-200">{deadline}</span>
            </div>
        </div>
    );
}
