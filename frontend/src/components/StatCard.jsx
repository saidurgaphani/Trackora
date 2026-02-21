import React from 'react';
import clsx from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { GlowingStarsBackgroundCard } from './ui/glowing-background-stars-card';
export default function StatCard({ title, value, icon, trend, className, trendLabel }) {
    const isPositive = trend > 0;

    return (
        <GlowingStarsBackgroundCard className={clsx("group", className)}>
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-300 pointer-events-none">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-50 mt-1 tracking-tight pointer-events-none">{value}</h3>
                </div>
                <div className="p-3 bg-primary-50 rounded-xl text-primary-500 shadow-sm pointer-events-none group-hover:bg-primary-100 transition-colors">
                    {icon}
                </div>
            </div>

            {trend !== undefined && (
                <div className="mt-8 flex items-center text-sm relative z-10 pointer-events-none">
                    <span className={clsx("flex items-center font-medium", isPositive ? "text-emerald-400" : "text-red-400")}>
                        {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                        {Math.abs(trend)}%
                    </span>
                    <span className="text-slate-500 ml-2 group-hover:text-slate-400 transition-colors duration-300">{trendLabel || 'vs last week'}</span>
                </div>
            )}
        </GlowingStarsBackgroundCard>
    );
}
