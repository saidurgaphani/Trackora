import { useAuth } from '../../hooks/useAuth';
import ProgressChart from '../../components/ProgressChart';
import { Mail, Briefcase, GraduationCap, MapPin, Award } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();

    // Mock Readiness Score
    const readinessScore = 78;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Profile Details Card */}
                <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar */}
                    <div className="w-32 h-32 shrink-0 rounded-full bg-primary-100 dark:bg-primary-900/50 border-4 border-primary-50 dark:border-slate-800 text-[var(--color-primary-500)] dark:text-primary-300 flex items-center justify-center font-bold text-5xl">
                        {user?.name?.charAt(0) || 'U'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4 w-full">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{user?.name || 'User Name'}</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize bg-slate-100 dark:bg-slate-800 inline-block px-3 py-1 rounded-full mt-2">
                                Role: {user?.role || 'Student'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <span className="text-sm">{user?.email || 'user@example.com'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <GraduationCap className="w-5 h-5 text-slate-400" />
                                <span className="text-sm">{user?.college || 'University Not Listed'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <Briefcase className="w-5 h-5 text-slate-400" />
                                <span className="text-sm">B.Tech - Computer Science</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <MapPin className="w-5 h-5 text-slate-400" />
                                <span className="text-sm">Campus, City</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Readiness Score Card */}
                <div className="col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        Placement Readiness
                    </h3>

                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Background Track */}
                            <circle
                                cx="50" cy="50" r="40"
                                className="stroke-slate-100 dark:stroke-slate-800"
                                strokeWidth="8" fill="transparent"
                            />
                            {/* Progress Ring */}
                            <circle
                                cx="50" cy="50" r="40"
                                className="stroke-[var(--color-primary-500)] transition-all duration-1000 ease-out"
                                strokeWidth="8" fill="transparent"
                                strokeDasharray={`${readinessScore * 2.51} 251`} /* 2 * PI * r = 251.2 */
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-slate-900 dark:text-slate-50">{readinessScore}%</span>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Score</span>
                        </div>
                    </div>

                    <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-6">
                        You are in the <span className="font-bold text-[var(--color-primary-500)]">Top 20%</span> of your cohort. Keep it up!
                    </p>
                </div>

            </div>

            {/* Activity Graph */}
            <div className="w-full h-[400px]">
                <ProgressChart title="Recent Activity" />
            </div>

        </div>
    );
}
